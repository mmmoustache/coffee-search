import { beforeEach, describe, expect, it, vi } from 'vitest';

const queryMock = vi.fn();

vi.mock('@/lib/db', () => ({
  pool: {
    query: (...args: any[]) => queryMock(...args),
  },
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<any>('react');
  return {
    ...actual,
    cache: (fn: any) => fn,
  };
});

const unstableCacheMock = vi.fn((...args: any[]) => args[0]);

vi.mock('next/cache', () => ({
  unstable_cache: (...args: any[]) => unstableCacheMock(...args),
}));

describe('product query fns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('getAllProducts is wrapped with unstable_cache and returns rows', async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ sku: 'A' }, { sku: 'B' }],
    });

    const { getAllProducts } = await import('@/lib/getProducts');

    expect(unstableCacheMock).toHaveBeenCalledTimes(1);

    const call = unstableCacheMock.mock.calls[0];
    const cacheKeys = call[1];
    const options = call[2];

    expect(cacheKeys).toEqual(['all-products']);
    expect(options).toEqual({ revalidate: 3600 });

    const rows = await getAllProducts(10, 20);

    expect(queryMock).toHaveBeenCalledTimes(1);
    const [sql, params] = queryMock.mock.calls[0];

    expect(String(sql)).toContain('LIMIT $1 OFFSET $2');
    expect(params).toEqual([10, 20]);
    expect(rows).toEqual([{ sku: 'A' }, { sku: 'B' }]);
  });
});
