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
