type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimitOrThrow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    const err = new Error(`Rate limit exceeded. Retry after ${retryAfterSeconds}s`);
    (err as any).status = 429;
    (err as any).retryAfterSeconds = retryAfterSeconds;
    throw err;
  }

  existing.count += 1;
}
