import { describe, expect, it } from 'vitest';
import { getTheme, isThemeSku, themes } from '@/utils/getTheme';

describe('isThemeSku', () => {
  it('returns true for known theme skus', () => {
    expect(isThemeSku('100001')).toBe(true);
    expect(isThemeSku('100010')).toBe(true);
  });

  it('returns false for unknown values', () => {
    expect(isThemeSku('999999')).toBe(false);
    expect(isThemeSku('')).toBe(false);
    expect(isThemeSku('10001')).toBe(false); // missing a digit
    expect(isThemeSku('100001 ')).toBe(false); // whitespace not trimmed
  });
});

describe('getTheme', () => {
  it('returns theme for a valid sku string', () => {
    expect(getTheme('100001')).toEqual(themes['100001']);
  });

  it('returns theme for a valid sku number', () => {
    expect(getTheme(100002)).toEqual(themes['100002']);
  });

  it('returns undefined for unknown sku', () => {
    expect(getTheme('999999')).toBeUndefined();
    expect(getTheme(999999)).toBeUndefined();
  });

  it('returns undefined for non-integer numbers that stringify differently', () => {
    expect(getTheme(100001.1)).toBeUndefined();
  });

  it('does not coerce whitespace or formatting', () => {
    expect(getTheme(' 100001')).toBeUndefined();
    expect(getTheme('100001 ')).toBeUndefined();
    expect(getTheme('0100001')).toBeUndefined();
  });
});
