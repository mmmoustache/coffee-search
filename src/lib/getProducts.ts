import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { Product } from '@/types/product';
import { pool } from '@/lib/db';

export const getProductBySku = cache(async (sku: string): Promise<Product | null> => {
  const { rows } = await pool.query<Product>(
    `
    SELECT id, sku, name, weight_g, category,
           origin, description, recommended_for,
           roast_level, body, sweetness, acidity, tasting_notes,
           is_active
    FROM products
    WHERE sku = $1
      AND (is_active IS NULL OR is_active = true)
    LIMIT 1
    `,
    [sku]
  );

  return rows[0] ?? null;
});

export const getAllProducts = unstable_cache(
  async (limit: number, offset: number) => {
    const { rows } = await pool.query(
      `
      SELECT id, sku, name, weight_g, category,
             origin, tasting_notes,
             roast_level, body, sweetness, acidity,
             is_active
      FROM products
      WHERE is_active IS NULL OR is_active = true
      ORDER BY name ASC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    return rows;
  },
  ['all-products'],
  { revalidate: 3600 }
);

export const getSimilarProductsBySku = cache(async (sku: string, limit = 6): Promise<Product[]> => {
  const { rows } = await pool.query<Product>(
    `
    WITH target AS (
      SELECT embedding
      FROM products
      WHERE sku = $1
        AND (is_active IS NULL OR is_active = true)
      LIMIT 1
    )
    SELECT
      p.id, p.sku, p.name, p.weight_g, p.category,
      p.origin, p.tasting_notes, p.recommended_for,
      p.roast_level, p.body, p.sweetness, p.acidity,
      p.description,
      p.is_active
    FROM products p, target t
    WHERE (p.is_active IS NULL OR p.is_active = true)
      AND p.sku <> $1
      AND p.embedding IS NOT NULL
      AND t.embedding IS NOT NULL
    ORDER BY p.embedding <=> t.embedding
    LIMIT $2
    `,
    [sku, limit]
  );

  // Fallback: if the target has no embedding, show something reasonable
  if (rows.length > 0) return rows;

  const fallback = await pool.query<Product>(
    `
    SELECT
      id, sku, name, weight_g, category,
      origin, tasting_notes, recommended_for,
      roast_level, body, sweetness, acidity,
      description,
      is_active
    FROM products
    WHERE (is_active IS NULL OR is_active = true)
      AND sku <> $1
    ORDER BY name ASC
    LIMIT $2
    `,
    [sku, limit]
  );

  return fallback.rows;
});
