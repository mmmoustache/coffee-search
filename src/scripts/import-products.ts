import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import 'dotenv/config';
import { toSql } from 'pgvector/pg';
import { normalizeSku, splitMultiline, toFloat, toInt } from '@/utils/formatter';
import { sha256 } from '@/utils/utils';
import { Product } from '@/types/product';
import { pool } from '@/lib/db';
import { embedText } from '@/lib/embeddings';
import { buildSearchText } from '@/lib/productSearchText';

async function main() {
  const csvPathArg = process.argv[2];
  if (!csvPathArg) {
    console.error('Usage: npx tsx scripts/import-products.ts <path-to-csv>');
    process.exit(1);
  }

  const csvPath = path.resolve(csvPathArg);
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const rows = parse(content, { columns: true, skip_empty_lines: true, trim: true }) as Product[];

  console.log(`CSV rows: ${rows.length}`);

  await pool.query(`UPDATE products SET is_active = false`);

  const existing = await pool.query<{ sku: string; search_text_hash: string | null }>(
    `SELECT sku, search_text_hash FROM products`
  );
  const hashBySku = new Map(existing.rows.map((r) => [r.sku, r.search_text_hash]));

  for (const r of rows) {
    const sku = normalizeSku(r.sku);
    const name = String(r.name ?? '').trim();
    if (!sku || !name) continue;

    const product = {
      name,
      category: r.category?.trim() ?? null,
      weight_g: r.weight_g === undefined ? null : toInt(r.weight_g),
      origin: splitMultiline(r.origin),
      description: r.description?.trim() ?? null,
      recommended_for: splitMultiline(r.recommended_for),
      roast_level: toFloat(r.roast_level),
      body: toInt(r.body),
      sweetness: toInt(r.sweetness),
      acidity: toInt(r.acidity),
      tasting_notes: splitMultiline(r.tasting_notes),
    };

    const searchText = buildSearchText(product);
    const hash = sha256(searchText);

    const previousHash = hashBySku.get(sku) ?? null;
    const needsEmbedding = previousHash !== hash;

    let embeddingSql: string | null = null;
    if (needsEmbedding) {
      const embedding = await embedText(searchText);
      embeddingSql = toSql(embedding);
      console.log(`Embedding updated for SKU ${sku}`);
    } else {
      console.log(`No embedding change for SKU ${sku}`);
    }

    await pool.query(
      `
      INSERT INTO products (
        sku, name, weight_g, category,
        origin, description, recommended_for,
        roast_level, body, sweetness, acidity,
        tasting_notes,
        is_active,
        search_text,
        search_text_hash,
        embedding,
        embedding_updated_at
      )
      VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,
        $8,$9,$10,$11,
        $12,
        true,
        $13,
        $14,
        $15::vector,
        CASE WHEN $15 IS NULL THEN NULL ELSE NOW() END
      )
      ON CONFLICT (sku) DO UPDATE SET
        name = EXCLUDED.name,
        weight_g = EXCLUDED.weight_g,
        category = EXCLUDED.category,
        origin = EXCLUDED.origin,
        description = EXCLUDED.description,
        recommended_for = EXCLUDED.recommended_for,
        roast_level = EXCLUDED.roast_level,
        body = EXCLUDED.body,
        sweetness = EXCLUDED.sweetness,
        acidity = EXCLUDED.acidity,
        tasting_notes = EXCLUDED.tasting_notes,
        is_active = true,
        search_text = EXCLUDED.search_text,
        search_text_hash = EXCLUDED.search_text_hash,

        embedding = COALESCE($15::vector, products.embedding),
        embedding_updated_at = CASE
          WHEN $15 IS NULL THEN products.embedding_updated_at
          ELSE NOW()
        END;
      `,
      [
        sku,
        product.name,
        product.weight_g,
        product.category,
        product.origin,
        product.description,
        product.recommended_for,
        product.roast_level,
        product.body,
        product.sweetness,
        product.acidity,
        product.tasting_notes,
        searchText,
        hash,
        embeddingSql,
      ]
    );
  }

  console.log('Done. Products not present in the CSV remain is_active=false.');
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
