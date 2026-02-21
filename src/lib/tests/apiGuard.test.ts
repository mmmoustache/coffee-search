import { describe, expect, it } from 'vitest';
import { assertStrictApi } from '@/lib/apiGuard';

function makeRequest(method: string, headers: Record<string, string> = {}) {
  return new Request('https://example.com/api', {
    method,
    headers,
  });
}

describe('assertStrictApi', () => {
  it('allows GET requests without content-type', () => {
    const req = makeRequest('GET');
    expect(() => assertStrictApi(req)).not.toThrow();
  });

  it('allows HEAD requests without content-type', () => {
    const req = makeRequest('HEAD');
    expect(() => assertStrictApi(req)).not.toThrow();
  });

  it('allows non-GET requests with application/json content-type', () => {
    const req = makeRequest('POST', {
      'content-type': 'application/json',
    });

    expect(() => assertStrictApi(req)).not.toThrow();
  });

  it('throws 415 for non-GET requests without application/json', () => {
    const req = makeRequest('POST', {
      'content-type': 'text/plain',
    });

    try {
      assertStrictApi(req);
      throw new Error('Expected to throw');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('blocked');
      expect(err.status).toBe(415);
    }
  });

  it('allows request when origin header is missing', () => {
    const req = makeRequest('POST', {
      'content-type': 'application/json',
      host: 'example.com',
    });

    expect(() => assertStrictApi(req)).not.toThrow();
  });

  it('allows request when host header is missing', () => {
    const req = makeRequest('POST', {
      'content-type': 'application/json',
      origin: 'https://example.com',
    });

    expect(() => assertStrictApi(req)).not.toThrow();
  });

  it('allows request when origin matches https host', () => {
    const req = makeRequest('POST', {
      'content-type': 'application/json',
      origin: 'https://example.com',
      host: 'example.com',
    });

    expect(() => assertStrictApi(req)).not.toThrow();
  });

  it('allows request when origin matches http host', () => {
    const req = makeRequest('POST', {
      'content-type': 'application/json',
      origin: 'http://example.com',
      host: 'example.com',
    });

    expect(() => assertStrictApi(req)).not.toThrow();
  });

  it('throws 403 when origin does not match host', () => {
    const req = makeRequest('POST', {
      'content-type': 'application/json',
      origin: 'https://evil.com',
      host: 'example.com',
    });

    try {
      assertStrictApi(req);
      throw new Error('Expected to throw');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('blocked');
      expect(err.status).toBe(403);
    }
  });
});
