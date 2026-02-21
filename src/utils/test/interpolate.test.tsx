import React from 'react';
import { describe, expect, it } from 'vitest';
import { interpolate, interpolateText } from '@/utils/interpolate';

describe('interpolate (ReactNode[])', () => {
  it('interpolates React nodes into an array', () => {
    const out = interpolate('Hello {name}!', {
      name: <strong key="s">Ron</strong>,
    });

    expect(out).toHaveLength(3);
    expect(out[0]).toBe('Hello ');
    expect(React.isValidElement(out[1])).toBe(true);
    expect((out[1] as any).type).toBe('strong');
    expect((out[1] as any).props.children).toBe('Ron');
    expect(out[2]).toBe('!');
  });

  it('supports multiple placeholders and preserves order', () => {
    const out = interpolate('{greet}, {name}.', {
      greet: 'Hi',
      name: 'Ron',
    });

    expect(out).toEqual(['Hi', ', ', 'Ron', '.']);
  });

  it('keeps the raw placeholder if the key is missing', () => {
    const out = interpolate('Hello {missing}!', {});

    expect(out).toEqual(['Hello ', '{missing}', '!']);
  });

  it('supports repeated keys', () => {
    const out = interpolate('{x}-{x}-{x}', { x: 'A' });
    expect(out).toEqual(['A', '-', 'A', '-', 'A']);
  });

  it('supports adjacent placeholders', () => {
    const out = interpolate('{a}{b}{c}', { a: '1', b: '2', c: '3' });
    expect(out).toEqual(['1', '2', '3']);
  });

  it('handles primitives correctly (0 and false must not be treated as missing)', () => {
    const out = interpolate('n={n}, ok={ok}', { n: 0, ok: false });

    expect(out).toEqual(['n=', 0, ', ok=', false]);
  });

  it('returns the original string as a single chunk when no placeholders exist', () => {
    const out = interpolate('No tokens here', {});
    expect(out).toEqual(['No tokens here']);
  });

  it('handles placeholders with any non-"}" chars as keys (by regex design)', () => {
    const out = interpolate('Hello {user.name}!', { 'user.name': 'Ron' } as any);
    expect(out).toEqual(['Hello ', 'Ron', '!']);
  });
});

describe('interpolateText (string)', () => {
  it('replaces placeholders with stringified values', () => {
    expect(interpolateText('Hello {name}! You have {n} messages.', { name: 'Ron', n: 3 })).toBe(
      'Hello Ron! You have 3 messages.'
    );
  });

  it('replaces missing/null/undefined with empty string', () => {
    expect(interpolateText('A:{a} B:{b} C:{c}', { a: 'x', b: null, c: undefined })).toBe(
      'A:x B: C:'
    );
    expect(interpolateText('{missing}', {})).toBe('');
  });

  it('supports allowed key characters: letters, numbers, underscore, dot, hyphen', () => {
    expect(
      interpolateText('{a_b}-{a.b}-{a-b}-{a1}', {
        a_b: 'U',
        'a.b': 'D',
        'a-b': 'H',
        a1: 'N',
      })
    ).toBe('U-D-H-N');
  });

  it('does not match keys with spaces (by design)', () => {
    expect(interpolateText('Hello { name }', { name: 'Ron' })).toBe('Hello { name }');
  });

  it('handles templates with no placeholders', () => {
    expect(interpolateText('No tokens here', { anything: 'x' })).toBe('No tokens here');
  });
});
