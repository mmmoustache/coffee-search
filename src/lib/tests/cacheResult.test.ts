import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCache, setCache } from '@/lib/cacheResult';

describe('cache utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when key does not exist', () => {
    expect(getCache('missing')).toBeNull();
  });

  it('returns stored value before ttl expires', () => {
    setCache('a', 123, 1000);

    expect(getCache<number>('a')).toBe(123);

    vi.advanceTimersByTime(999);
    expect(getCache<number>('a')).toBe(123);
  });

  it('returns null after ttl expires', () => {
    setCache('b', 'hello', 1000);

    vi.advanceTimersByTime(1001);
    expect(getCache<string>('b')).toBeNull();
  });

  it('deletes expired items so they do not persist', () => {
    setCache('c', 'gone', 500);

    vi.advanceTimersByTime(600);

    expect(getCache('c')).toBeNull();
    expect(getCache('c')).toBeNull();
  });

  it('overwrites existing key with new ttl and value', () => {
    setCache('x', 1, 1000);

    vi.advanceTimersByTime(500);

    setCache('x', 2, 1000);

    expect(getCache<number>('x')).toBe(2);

    vi.advanceTimersByTime(1001);
    expect(getCache<number>('x')).toBeNull();
  });

  it('works with objects as values', () => {
    const obj = { a: 1 };

    setCache('obj', obj, 1000);

    expect(getCache<typeof obj>('obj')).toEqual({ a: 1 });
  });
});
