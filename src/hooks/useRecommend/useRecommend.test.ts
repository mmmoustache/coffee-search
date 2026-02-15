import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (v: T) => void;
  reject: (e: unknown) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function runSubmitAndCaptureError(
  submit: (args: { query: string }) => Promise<unknown>,
  query: string
) {
  let promise!: Promise<unknown>;

  act(() => {
    promise = submit({ query });
  });

  let thrown: unknown = null;

  await act(async () => {
    try {
      await promise;
    } catch (e) {
      thrown = e;
    }
  });

  return thrown;
}

describe('useRecommend', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('starts idle with no data/error', async () => {
    vi.doMock('@/utils/flags', () => ({ USE_MOCK_RECOMMEND: false }));
    vi.doMock('@/lib/apiClient', () => ({ apiJson: vi.fn() }));
    vi.doMock('@/mocks/openAIResponse.json', () => ({ default: { results: [] } }));

    const { useRecommend } = await import('@/hooks/useRecommend/useRecommend');

    const { result } = renderHook(() => useRecommend());

    expect(result.current.status).toBe('idle');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('submits via apiJson when USE_MOCK_RECOMMEND is false and sets success state', async () => {
    vi.doMock('@/utils/flags', () => ({ USE_MOCK_RECOMMEND: false }));

    const apiJson = vi.fn();
    vi.doMock('@/lib/apiClient', () => ({ apiJson }));
    vi.doMock('@/mocks/openAIResponse.json', () => ({ default: { results: [] } }));

    const { useRecommend } = await import('@/hooks/useRecommend/useRecommend');

    const fakeResponse = { results: [{ sku: '1', name: 'Coffee One' }] };
    const d = deferred<typeof fakeResponse>();
    apiJson.mockReturnValueOnce(d.promise);

    const { result } = renderHook(() => useRecommend());

    // Start submit
    let promise!: Promise<unknown>;
    act(() => {
      promise = result.current.submit({ query: 'espresso' });
    });

    expect(result.current.status).toBe('loading');
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Resolve
    await act(async () => {
      d.resolve(fakeResponse);
      await promise;
    });

    expect(apiJson).toHaveBeenCalledTimes(1);
    expect(apiJson).toHaveBeenCalledWith('/api/recommend', {
      method: 'POST',
      body: { query: 'espresso' },
    });

    expect(result.current.status).toBe('success');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(fakeResponse);
    expect(result.current.error).toBeNull();
  });

  it('uses mockResponse and does not call apiJson when USE_MOCK_RECOMMEND is true', async () => {
    vi.doMock('@/utils/flags', () => ({ USE_MOCK_RECOMMEND: true }));

    const apiJson = vi.fn();
    vi.doMock('@/lib/apiClient', () => ({ apiJson }));

    const mockResponse = { results: [{ sku: 'MOCK', name: 'Mock Coffee' }] };
    vi.doMock('@/mocks/openAIResponse.json', () => ({ default: mockResponse }));

    const { useRecommend } = await import('@/hooks/useRecommend/useRecommend');

    const { result } = renderHook(() => useRecommend());

    let returned: unknown;
    await act(async () => {
      returned = await result.current.submit({ query: 'anything' });
    });

    expect(apiJson).not.toHaveBeenCalled();

    expect(returned).toEqual(mockResponse);
    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('sets error status and rethrows when apiJson rejects', async () => {
    vi.doMock('@/utils/flags', () => ({ USE_MOCK_RECOMMEND: false }));

    const apiJson = vi.fn();
    vi.doMock('@/lib/apiClient', () => ({ apiJson }));
    vi.doMock('@/mocks/openAIResponse.json', () => ({ default: { results: [] } }));

    const { useRecommend } = await import('@/hooks/useRecommend/useRecommend');

    const boom = new Error('Nope');
    apiJson.mockRejectedValueOnce(boom);

    const { result } = renderHook(() => useRecommend());

    const thrown = await runSubmitAndCaptureError(result.current.submit, 'latte');

    // rethrow happened
    expect(thrown).toBe(boom);

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Nope');
  });

  it('reset clears data/error and returns to idle', async () => {
    vi.doMock('@/utils/flags', () => ({ USE_MOCK_RECOMMEND: false }));

    const apiJson = vi.fn();
    vi.doMock('@/lib/apiClient', () => ({ apiJson }));
    vi.doMock('@/mocks/openAIResponse.json', () => ({ default: { results: [] } }));

    const { useRecommend } = await import('@/hooks/useRecommend/useRecommend');

    apiJson.mockResolvedValueOnce({ results: [{ sku: '1', name: 'Coffee One' }] });

    const { result } = renderHook(() => useRecommend());

    await act(async () => {
      await result.current.submit({ query: 'filter' });
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('clears previous error on new submit attempt (sets error to null immediately)', async () => {
    vi.doMock('@/utils/flags', () => ({ USE_MOCK_RECOMMEND: false }));

    const apiJson = vi.fn();
    vi.doMock('@/lib/apiClient', () => ({ apiJson }));
    vi.doMock('@/mocks/openAIResponse.json', () => ({ default: { results: [] } }));

    const { useRecommend } = await import('@/hooks/useRecommend/useRecommend');

    const firstFail = new Error('First fail');
    const second = deferred<any>();

    apiJson.mockRejectedValueOnce(firstFail);
    apiJson.mockReturnValueOnce(second.promise);

    const { result } = renderHook(() => useRecommend());

    // First submit fails
    const thrown = await runSubmitAndCaptureError(result.current.submit, 'x');
    expect(thrown).toBe(firstFail);

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
    expect(result.current.error).toBe('First fail');

    // Second submit begins: should clear error immediately + loading
    let secondPromise!: Promise<unknown>;
    act(() => {
      secondPromise = result.current.submit({ query: 'y' });
    });

    expect(result.current.status).toBe('loading');
    expect(result.current.error).toBeNull();

    // success
    await act(async () => {
      second.resolve({ results: [{ sku: '2', name: 'Coffee Two' }] });
      await secondPromise;
    });

    expect(result.current.status).toBe('success');
    expect(result.current.error).toBeNull();
  });
});
