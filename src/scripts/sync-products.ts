import 'dotenv/config';
import { toSql } from 'pgvector/pg';
import { sha256 } from '@/utils/utils';
import { pool } from '@/lib/db';
import { embedText } from '@/lib/embeddings';
import { buildSearchText } from '@/lib/productSearchText';

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { rows } = await pool.query<any>(`
    SELECT
      id, sku, name, weight_g, category,
      origin, description, recommended_for,
      roast_level, body, sweetness, acidity,
      tasting_notes,
      search_text_hash
    FROM products
    WHERE is_active = true
  `);

  console.log(`Active products: ${rows.length}`);

  let updated = 0;

  for (const c of rows) {
    const searchText = buildSearchText(c);
    const hash = sha256(searchText);

    if (c.search_text_hash === hash) continue;

    const embedding = await embedText(searchText);
    const embeddingSql = toSql(embedding);

    await pool.query(
      `
      UPDATE products
      SET
        search_text = $1,
        search_text_hash = $2,
        embedding = $3::vector,
        embedding_updated_at = NOW()
      WHERE id = $4
      `,
      [searchText, hash, embeddingSql, c.id]
    );

    updated += 1;
    console.log(`Re-embedded: ${c.sku} (${c.name})`);
  }

  console.log(`Done. Updated embeddings: ${updated}`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
