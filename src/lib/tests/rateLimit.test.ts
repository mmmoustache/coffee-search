import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('rateLimitOrThrow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows the first call and creates a new bucket', async () => {
    const { rateLimitOrThrow } = await import('@/lib/rateLimit');

    expect(() => rateLimitOrThrow('k1', 3, 1000)).not.toThrow();
  });

  it('increments count until the limit is reached', async () => {
    const { rateLimitOrThrow } = await import('@/lib/rateLimit');

    expect(() => rateLimitOrThrow('k1', 3, 1000)).not.toThrow();
    expect(() => rateLimitOrThrow('k1', 3, 1000)).not.toThrow();
    expect(() => rateLimitOrThrow('k1', 3, 1000)).not.toThrow();
  });

  it('throws when the limit would be exceeded', async () => {
    const { rateLimitOrThrow } = await import('@/lib/rateLimit');

    rateLimitOrThrow('k1', 2, 1000);
    rateLimitOrThrow('k1', 2, 1000);

    expect(() => rateLimitOrThrow('k1', 2, 1000)).toThrow(/rate limit exceeded/i);
  });

  it('throws with status 429 and retryAfterSeconds', async () => {
    const { rateLimitOrThrow } = await import('@/lib/rateLimit');

    rateLimitOrThrow('k1', 1, 1000);

    try {
      rateLimitOrThrow('k1', 1, 1000);
      throw new Error('Expected to throw');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.status).toBe(429);
      expect(err.retryAfterSeconds).toBe(1);
      expect(err.message).toMatch(/retry after 1s/i);
    }
  });

  it('allows requests again after the window resets (now > resetAt)', async () => {
    const { rateLimitOrThrow } = await import('@/lib/rateLimit');

    rateLimitOrThrow('k1', 1, 1000);

    vi.advanceTimersByTime(1001);

    expect(() => rateLimitOrThrow('k1', 1, 1000)).not.toThrow();
  });

  it('does not reset exactly at resetAt (boundary: now === resetAt is still limited)', async () => {
    const { rateLimitOrThrow } = await import('@/lib/rateLimit');

    rateLimitOrThrow('k1', 1, 1000);

    vi.advanceTimersByTime(1000);

    expect(() => rateLimitOrThrow('k1', 1, 1000)).toThrow(/rate limit exceeded/i);

    vi.advanceTimersByTime(1);

    expect(() => rateLimitOrThrow('k1', 1, 1000)).not.toThrow();
  });

  it('tracks separate keys independently', async () => {
    const { rateLimitOrThrow } = await import('@/lib/rateLimit');

    rateLimitOrThrow('k1', 1, 1000);

    expect(() => rateLimitOrThrow('k2', 1, 1000)).not.toThrow();
    expect(() => rateLimitOrThrow('k1', 1, 1000)).toThrow();
  });
});
