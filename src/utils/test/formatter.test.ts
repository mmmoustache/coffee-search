import { describe, expect, it } from 'vitest';
import { normalizeSku, parseWeightG, splitMultiline, toFloat, toInt } from '@/utils/formatter';

describe('toInt', () => {
  it('returns null for null/undefined', () => {
    expect(toInt(null)).toBeNull();
    expect(toInt(undefined)).toBeNull();
  });

  it('parses integers from strings and trims whitespace', () => {
    expect(toInt('  42  ')).toBe(42);
    expect(toInt('0')).toBe(0);
  });

  it('truncates floats toward zero', () => {
    expect(toInt('3.9')).toBe(3);
    expect(toInt('-3.9')).toBe(-3);
    expect(toInt(12.99)).toBe(12);
  });

  it('returns null for non-finite numbers', () => {
    expect(toInt('NaN')).toBeNull();
    expect(toInt('Infinity')).toBeNull();
    expect(toInt('-Infinity')).toBeNull();
  });

  it('returns null for non-numeric strings', () => {
    expect(toInt('abc')).toBeNull();
    expect(toInt('12abc')).toBeNull();
  });
});

describe('toFloat', () => {
  it('returns null for null/undefined', () => {
    expect(toFloat(null)).toBeNull();
    expect(toFloat(undefined)).toBeNull();
  });

  it('parses floats and trims whitespace', () => {
    expect(toFloat('  3.14 ')).toBe(3.14);
    expect(toFloat('2')).toBe(2);
  });

  it('returns null for non-finite numbers', () => {
    expect(toFloat('NaN')).toBeNull();
    expect(toFloat('Infinity')).toBeNull();
  });

  it('returns null for non-numeric strings', () => {
    expect(toFloat('abc')).toBeNull();
  });
});

describe('splitMultiline', () => {
  it('returns [] for non-strings', () => {
    expect(splitMultiline(null)).toEqual([]);
    expect(splitMultiline(undefined)).toEqual([]);
    expect(splitMultiline(123)).toEqual([]);
    expect(splitMultiline({})).toEqual([]);
  });

  it('splits on \\n and trims each line, dropping blanks', () => {
    expect(splitMultiline('a\nb\nc')).toEqual(['a', 'b', 'c']);
    expect(splitMultiline('  a  \n \n  b  ')).toEqual(['a', 'b']);
  });

  it('handles Windows newlines (\\r\\n)', () => {
    expect(splitMultiline('a\r\nb\r\n\r\nc')).toEqual(['a', 'b', 'c']);
  });
});

describe('parseWeightG', () => {
  it('returns null for non-strings', () => {
    expect(parseWeightG(null)).toBeNull();
    expect(parseWeightG(250)).toBeNull();
  });

  it('parses integer grams from strings like "250g" or "250 g" (case-insensitive)', () => {
    expect(parseWeightG('250g')).toBe(250);
    expect(parseWeightG('250 g')).toBe(250);
    expect(parseWeightG('  250   g  ')).toBe(250);
    expect(parseWeightG('250G')).toBe(250);
  });

  it('returns null for invalid formats', () => {
    expect(parseWeightG('250')).toBeNull();
    expect(parseWeightG('250kg')).toBeNull();
    expect(parseWeightG('g')).toBeNull();
    expect(parseWeightG('25.5 g')).toBeNull();
  });
});

describe('normalizeSku', () => {
  it('stringifies and trims', () => {
    expect(normalizeSku('  ABC-123  ')).toBe('ABC-123');
    expect(normalizeSku(null)).toBe('');
    expect(normalizeSku(undefined)).toBe('');
  });

  it('removes trailing ".0" only at the end', () => {
    expect(normalizeSku('123.0')).toBe('123');
    expect(normalizeSku(123.0)).toBe('123');
    expect(normalizeSku('123.01')).toBe('123.01');
    expect(normalizeSku('123.0 ')).toBe('123');
  });
});
