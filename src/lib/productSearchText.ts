type Product = {
  name: string;
  category?: string | null;
  weight_g?: number | null;
  origin?: string[] | null;
  description?: string | null;
  recommended_for?: string[] | null;
  roast_level?: number | null;
  body?: number | null;
  sweetness?: number | null;
  acidity?: number | null;
  tasting_notes?: string[] | null;
};

// Build string for embeddings
export function buildSearchText(c: Product): string {
  const parts: string[] = [];
  const profile: string[] = [];

  if (c.name) {
    parts.push(`Name: ${c.name}`);
  }

  if (c.category) {
    parts.push(`Type: ${c.category}`);
  }

  if (typeof c.weight_g === "number") {
    parts.push(`Weight: ${c.weight_g}g`);
  }

  if (c.origin?.length) {
    parts.push(`Origin: ${c.origin.join(", ")}`);
  }

  if (c.tasting_notes?.length) {
    parts.push(`Tasting notes: ${c.tasting_notes.join(", ")}`);
  }

  if (typeof c.roast_level === "number") {
    profile.push(`roast ${c.roast_level}/5`);
  }

  if (typeof c.body === "number") {
    profile.push(`body ${c.body}/5`);
  }

  if (typeof c.sweetness === "number") {
    profile.push(`sweetness ${c.sweetness}/5`);
  }

  if (typeof c.acidity === "number") {
    profile.push(`acidity ${c.acidity}/5`);
  }

  if (profile.length) {
    parts.push(`Profile: ${profile.join(", ")}`);
  }

  if (c.recommended_for?.length) {
    parts.push(`Recommended for: ${c.recommended_for.join(", ")}`);
  }

  if (c.description) {
    parts.push(`Description: ${c.description}`);
  }

  return parts.join("\n");
}
