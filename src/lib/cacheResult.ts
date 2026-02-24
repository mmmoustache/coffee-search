type CacheItem<T> = {
  value: T;
  expiresAt: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, CacheItem<any>>();

export function getCache<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}
