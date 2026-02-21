import { describe, expect, it } from 'vitest';
import { getClientIp } from '@/utils/getClientIp';

function makeReq(headers: Record<string, string>) {
  return new Request('https://example.com', { headers });
}

describe('getClientIp', () => {
  it('uses the first IP from x-forwarded-for', () => {
    const req = makeReq({
      'x-forwarded-for': '203.0.113.1, 70.41.3.18, 150.172.238.178',
    });

    expect(getClientIp(req)).toBe('203.0.113.1');
  });

  it('trims whitespace around forwarded IP', () => {
    const req = makeReq({
      'x-forwarded-for': '   10.0.0.1   ',
    });

    expect(getClientIp(req)).toBe('10.0.0.1');
  });

  it('falls back to x-real-ip when forwarded-for is missing', () => {
    const req = makeReq({
      'x-real-ip': '192.168.1.5',
    });

    expect(getClientIp(req)).toBe('192.168.1.5');
  });

  it('prefers x-forwarded-for over x-real-ip when both exist', () => {
    const req = makeReq({
      'x-forwarded-for': '1.1.1.1',
      'x-real-ip': '2.2.2.2',
    });

    expect(getClientIp(req)).toBe('1.1.1.1');
  });

  it('returns "unknown" when no headers are present', () => {
    const req = makeReq({});
    expect(getClientIp(req)).toBe('unknown');
  });

  it('returns "unknown" when headers exist but are empty strings', () => {
    const req = makeReq({
      'x-forwarded-for': '',
      'x-real-ip': '',
    });

    expect(getClientIp(req)).toBe('unknown');
  });
});
