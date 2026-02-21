import { describe, expect, it } from 'vitest';
import { safeJson } from '@/lib/safeJson';

describe('safeJson', () => {
  it('parses normal JSON', () => {
    expect(safeJson('{"a":1}')).toEqual({ a: 1 });
  });

  it('trims surrounding whitespace before parsing', () => {
    expect(safeJson('   \n  {"a":1}  \n ')).toEqual({ a: 1 });
  });

  it('parses JSON inside a fenced code block without language', () => {
    const input = `
\`\`\`
{"a":1,"b":"x"}
\`\`\`
`;
    expect(safeJson(input)).toEqual({ a: 1, b: 'x' });
  });

  it('parses JSON inside a fenced code block with language', () => {
    const input = `
\`\`\`json
{"a":1,"b":[1,2,3]}
\`\`\`
`;
    expect(safeJson(input)).toEqual({ a: 1, b: [1, 2, 3] });
  });

  it('handles fences where opening has no newline after language', () => {
    const input = '```json{"a":1}```';
    expect(safeJson(input)).toEqual({ a: 1 });
  });

  it('does not remove backticks that are not at the start/end', () => {
    const input = '{"a":"```"}';
    expect(() => safeJson(input)).not.toThrow();
    expect(safeJson(input)).toEqual({ a: '```' });
  });

  it('throws on invalid JSON', () => {
    expect(() => safeJson('not json')).toThrow();
  });

  it('throws if fenced content is not valid JSON', () => {
    const input = `
\`\`\`json
not json
\`\`\`
`;
    expect(() => safeJson(input)).toThrow();
  });
});
