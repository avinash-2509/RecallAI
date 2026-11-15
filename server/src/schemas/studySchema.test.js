import { describe, expect, it } from 'vitest';
import { parseAndNormalizeStudySet } from './studySchema.js';

const request = { mode: 'both', count: 5, difficulty: 'beginner', input: 'A sufficiently long topic for testing.' };
const valid = { title: 'OS', description: 'Core ideas', flashcards: [{ question: 'Process?', answer: 'A running program.' }], quiz: [{ question: 'Which is a process?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'A is correct.' }] };

describe('AI study-set validation', () => {
  it('accepts valid output and assigns trusted IDs', () => expect(parseAndNormalizeStudySet(JSON.stringify(valid), request).quiz[0].id).toBe('q1'));
  it('rejects malformed JSON safely', () => expect(() => parseAndNormalizeStudySet('{title: OS}', request)).toThrowError(/validate/i));
  it('rejects missing required fields', () => expect(() => parseAndNormalizeStudySet({ title: 'OS', description: '', flashcards: [{ question: 'Thread?' }], quiz: [] }, request)).toThrow());
  it('rejects an invalid answer index', () => expect(() => parseAndNormalizeStudySet({ ...valid, quiz: [{ ...valid.quiz[0], correctAnswer: 7 }] }, request)).toThrow());
  it('classifies an empty response', () => expect(() => parseAndNormalizeStudySet('   ', request)).toThrowError(/no usable/i));
});
