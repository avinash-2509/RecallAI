import { describe, expect, it } from 'vitest';
import { incorrectQuestions, scoreQuiz } from './quizHelpers.js';

const questions = [{ id: 'q1', correctAnswer: 1 }, { id: 'q2', correctAnswer: 0 }, { id: 'q3', correctAnswer: 3 }];
describe('quiz helpers', () => {
  it('scores correct and incorrect answers', () => expect(scoreQuiz(questions, { q1: 1, q2: 2, q3: 3 })).toEqual({ correct: 2, incorrect: 1, total: 3, percentage: 67 }));
  it('creates a retest with only incorrect questions', () => expect(incorrectQuestions(questions, { q1: 1, q2: 2, q3: 3 }).map((q) => q.id)).toEqual(['q2']));
});
