import { describe, expect, it } from 'vitest';
import { getMessageType, messageTypes } from '@/utils/getMessageType';

describe('getMessageType', () => {
  it('returns the correct config for error', () => {
    expect(getMessageType('error')).toEqual(messageTypes.error);
    expect(getMessageType('error').icon).toBe('exclamation-square');
  });

  it('returns the correct config for success', () => {
    expect(getMessageType('success')).toEqual(messageTypes.success);
    expect(getMessageType('success').textColor).toBe('text-white');
  });

  it('returns the correct config for warning', () => {
    expect(getMessageType('warning')).toEqual(messageTypes.warning);
    expect(getMessageType('warning').borderColor).toBe('border-yellow-400');
  });
});
