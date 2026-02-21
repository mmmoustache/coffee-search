import { describe, expect, it } from 'vitest';
import { buildSearchText } from '@/lib/productSearchText';

describe('buildSearchText', () => {
  it('builds a full multi-line search text when all fields exist', () => {
    const row = {
      name: 'Moon Roast',
      category: 'Filter',
      weight_g: 250,
      origin: ['Colombia', 'Ethiopia'],
      tasting_notes: ['chocolate', 'berry'],
      roast_level: 4,
      body: 3,
      sweetness: 2,
      acidity: 1,
      recommended_for: ['espresso', 'latte'],
      description: 'Rich and smooth.',
    } as any;

    const text = buildSearchText(row);

    expect(text).toContain('Name: Moon Roast');
    expect(text).toContain('Type: Filter');
    expect(text).toContain('Weight: 250g');
    expect(text).toContain('Origin: Colombia, Ethiopia');
    expect(text).toContain('Tasting notes: chocolate, berry');
    expect(text).toContain('Profile: roast 4/5, body 3/5, sweetness 2/5, acidity 1/5');
    expect(text).toContain('Recommended for: espresso, latte');
    expect(text).toContain('Description: Rich and smooth.');
    expect(text.split('\n').length).toBeGreaterThan(1);
  });

  it('omits optional lines when values are missing/empty', () => {
    const row = {
      name: 'Just Coffee',
      category: '',
      weight_g: undefined,
      origin: [],
      tasting_notes: undefined,
      roast_level: undefined,
      body: null,
      sweetness: '3', // wrong type, should be omitted
      acidity: undefined,
      recommended_for: [],
      description: '',
    } as any;

    const text = buildSearchText(row);

    expect(text).toContain('Name: Just Coffee');

    expect(text).not.toContain('Type:');
    expect(text).not.toContain('Weight:');
    expect(text).not.toContain('Origin:');
    expect(text).not.toContain('Tasting notes:');
    expect(text).not.toContain('Profile:');
    expect(text).not.toContain('Recommended for:');
    expect(text).not.toContain('Description:');

    expect(text).toBe('Name: Just Coffee');
  });

  it('includes Profile line when at least one numeric profile value exists', () => {
    const row = {
      name: 'Profile Coffee',
      roast_level: 5,
      body: undefined,
      sweetness: undefined,
      acidity: undefined,
    } as any;

    const text = buildSearchText(row);

    expect(text).toContain('Name: Profile Coffee');
    expect(text).toContain('Profile: roast 5/5');
    expect(text).not.toContain('body');
    expect(text).not.toContain('sweetness');
    expect(text).not.toContain('acidity');
  });

  it('treats weight_g=0 as valid number (included)', () => {
    const row = {
      name: 'Zero Weight Test',
      weight_g: 0,
    } as any;

    const text = buildSearchText(row);

    expect(text).toContain('Name: Zero Weight Test');
    expect(text).toContain('Weight: 0g');
  });

  it('does not include Origin/Tasting/Recommended when arrays are empty, but includes when non-empty', () => {
    const base = { name: 'Arrays Test' } as any;

    expect(buildSearchText({ ...base, origin: [] })).not.toContain('Origin:');
    expect(buildSearchText({ ...base, origin: ['Kenya'] })).toContain('Origin: Kenya');

    expect(buildSearchText({ ...base, tasting_notes: [] })).not.toContain('Tasting notes:');
    expect(buildSearchText({ ...base, tasting_notes: ['citrus'] })).toContain(
      'Tasting notes: citrus'
    );

    expect(buildSearchText({ ...base, recommended_for: [] })).not.toContain('Recommended for:');
    expect(buildSearchText({ ...base, recommended_for: ['filter'] })).toContain(
      'Recommended for: filter'
    );
  });
});
