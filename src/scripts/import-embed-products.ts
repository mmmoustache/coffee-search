import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import 'dotenv/config';
import { toSql } from 'pgvector/pg';
import { parseWeightG, splitMultiline, toFloat, toInt } from '@/utils/formatter';
import { pool } from '@/lib/db';
import { embedText } from '@/lib/embeddings';
import { buildSearchText } from '@/lib/productSearchText';

type CsvRow = {
  sku: string;
  name: string;
  weight: string;
  category: string;
  origin: string;
  description: string;
  recommended_for: string;
  roast_level: string;
  body: string;
  sweetness: string;
  acidity: string;
  tasting_notes: string;
};

async function upsertProduct(row: CsvRow) {
  const sku = String(row.sku).trim();

  const weight_g = parseWeightG(row.weight);
  const origin = splitMultiline(row.origin);
  const recommended_for = splitMultiline(row.recommended_for);
  const tasting_notes = splitMultiline(row.tasting_notes);

  const roast_level = toFloat(row.roast_level);
  const body = toInt(row.body);
  const sweetness = toInt(row.sweetness);
  const acidity = toInt(row.acidity);

  const productForText = {
    name: row.name?.trim(),
    category: row.category?.trim(),
    weight_g,
    origin,
    description: row.description?.trim(),
    recommended_for,
    roast_level,
    body,
    sweetness,
    acidity,
    tasting_notes,
  };

  const search_text = buildSearchText(productForText);
  const embedding = await embedText(search_text);
  const embeddingSql = toSql(embedding);

  await pool.query(
    `
    INSERT INTO products (
      sku, name, weight_g, category,
      origin, description, recommended_for,
      roast_level, body, sweetness, acidity,
      tasting_notes,
      search_text, embedding, embedding_updated_at
    )
    VALUES (
      $1,$2,$3,$4,
      $5,$6,$7,
      $8,$9,$10,$11,
      $12,
      $13,$14,NOW()
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
      search_text = EXCLUDED.search_text,
      embedding = EXCLUDED.embedding,
      embedding_updated_at = NOW()
    `,
    [
      sku,
      row.name?.trim(),
      weight_g,
      row.category?.trim() ?? null,
      origin,
      row.description?.trim() ?? null,
      recommended_for,
      roast_level,
      body,
      sweetness,
      acidity,
      tasting_notes,
      search_text,
      embeddingSql,
    ]
  );

  return sku;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('❌ Please provide a CSV path:');
    console.error('Usage: node scripts/import-embed-products.ts <path-to-csv>');
    process.exit(1);
  }

  const file = path.resolve(csvPath);

  if (!fs.existsSync(file)) {
    console.error(`❌ File not found: ${file}`);
    process.exit(1);
  }

  const content = fs.readFileSync(file, 'utf8');

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  console.log(`Found ${records.length} products in CSV`);

  for (const r of records) {
    const sku = await upsertProduct(r);
    console.log(`Upserted + embedded SKU ${sku} (${r.name})`);
  }

  await pool.end();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
