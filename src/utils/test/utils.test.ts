import { describe, expect, it } from 'vitest';
import { sha256 } from '@/utils/utils';

describe('sha256', () => {
  it('hashes a simple string correctly', () => {
    expect(sha256('hello')).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    );
  });

  it('hashes empty string correctly', () => {
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('hashes unicode strings correctly', () => {
    expect(sha256('こんにちは')).toBe(
      '125aeadf27b0459b8760c13a3d80912dfa8a81a68261906f60d87f4a0268646c'
    );
  });

  it('is deterministic (same input always produces same output)', () => {
    const value = sha256('test-input');
    expect(sha256('test-input')).toBe(value);
    expect(sha256('test-input')).toBe(value);
  });

  it('produces a 64-character hex string', () => {
    const hash = sha256('anything');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
