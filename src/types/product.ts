export type Product = {
  acidity?: number | null;
  body?: number | null;
  category?: string | null;
  description?: string | null;
  name: string;
  origin?: string[] | null;
  recommended_for?: string[] | null;
  roast_level?: number | null;
  sweetness?: number | null;
  tasting_notes?: string[] | null;
  weight_g?: number | null;
};

export type CSVRow = Product & {
  sku: string | number;
};
