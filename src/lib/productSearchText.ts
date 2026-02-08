import { Product } from '@/types/product';

const when = <T>(cond: unknown, value: T): T | null => (cond ? value : null);

// Build string for embeddings
export function buildSearchText(c: Product): string {
  const profile = [
    when(typeof c.roast_level === 'number', `roast ${c.roast_level}/5`),
    when(typeof c.body === 'number', `body ${c.body}/5`),
    when(typeof c.sweetness === 'number', `sweetness ${c.sweetness}/5`),
    when(typeof c.acidity === 'number', `acidity ${c.acidity}/5`),
  ].filter(Boolean);

  return [
    when(c.name, `Name: ${c.name}`),
    when(c.category, `Type: ${c.category}`),
    when(typeof c.weight_g === 'number', `Weight: ${c.weight_g}g`),
    when(c.origin?.length, `Origin: ${c.origin?.join(', ')}`),
    when(c.tasting_notes?.length, `Tasting notes: ${c.tasting_notes?.join(', ')}`),
    when(profile.length, `Profile: ${profile.join(', ')}`),
    when(c.recommended_for?.length, `Recommended for: ${c.recommended_for?.join(', ')}`),
    when(c.description, `Description: ${c.description}`),
  ]
    .filter(Boolean)
    .join('\n');
}
