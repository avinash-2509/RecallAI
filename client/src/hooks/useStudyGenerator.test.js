import { describe, expect, it } from 'vitest';
import { isLatestRequest } from './useStudyGenerator.js';

describe('request identity guard', () => {
  it('prevents an older response from being current', () => {
    const sequence = { current: 2 };
    expect(isLatestRequest(sequence, 1)).toBe(false);
    expect(isLatestRequest(sequence, 2)).toBe(true);
  });
});
