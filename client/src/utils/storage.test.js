import { describe, expect, it } from 'vitest';
import { parseStoredSessions } from './storage.js';

describe('stored sessions', () => {
  it('returns an empty list for corrupted JSON', () => expect(parseStoredSessions('{broken')).toEqual([]));
  it('filters malformed sessions without crashing', () => expect(parseStoredSessions(JSON.stringify([{ id: 'x' }, null]))).toEqual([]));
});
