import { z } from 'zod';
import { ApiError } from '../utils/apiErrors.js';

export const MODES = ['flashcards', 'quiz', 'both'];
export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export const generateRequestSchema = z.object({
  input: z.string().trim().min(20).max(12000),
  mode: z.enum(MODES),
  difficulty: z.enum(DIFFICULTIES),
  count: z.union([z.literal(5), z.literal(10), z.literal(15)])
}).strict();

export const rawStudySetSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(300).default(''),
  flashcards: z.array(z.object({
    question: z.string().trim().min(1).max(1000),
    answer: z.string().trim().min(1).max(2000)
  }).passthrough()).max(20).default([]),
  quiz: z.array(z.object({
    question: z.string().trim().min(1).max(1000),
    options: z.array(z.string().trim().min(1).max(500)).length(4),
    correctAnswer: z.number().int().min(0).max(3),
    explanation: z.string().trim().min(1).max(1500)
  }).passthrough()).max(20).default([])
}).strict();

export function parseAndNormalizeStudySet(raw, request) {
  if (raw === null || raw === undefined || (typeof raw === 'string' && !raw.trim())) {
    throw new ApiError('EMPTY_AI_OUTPUT', 'The AI returned no usable content. Please try again.', 502, true);
  }
  let value = raw;
  if (typeof raw === 'string') {
    try { value = JSON.parse(raw); }
    catch { throw new ApiError('INVALID_AI_OUTPUT', 'We could not validate the generated study set. Please try again.', 502, true); }
  }
  const result = rawStudySetSchema.safeParse(value);
  if (!result.success) {
    throw new ApiError('INVALID_AI_OUTPUT', 'We could not validate the generated study set. Please try again.', 502, true);
  }
  const { title, description } = result.data;
  const flashcards = result.data.flashcards.slice(0, request.count).map((card, index) => ({
    id: `f${index + 1}`, question: card.question, answer: card.answer
  }));
  const quiz = result.data.quiz.slice(0, request.count).map((question, index) => ({
    id: `q${index + 1}`, ...question
  }));
  const needsFlashcards = request.mode !== 'quiz';
  const needsQuiz = request.mode !== 'flashcards';
  if ((needsFlashcards && !flashcards.length) || (needsQuiz && !quiz.length)) {
    throw new ApiError('EMPTY_AI_OUTPUT', 'The AI did not generate usable items for the selected mode.', 502, true);
  }
  return {
    title,
    description,
    flashcards: needsFlashcards ? flashcards : [],
    quiz: needsQuiz ? quiz : []
  };
}

export const studySetJsonSchema = {
  type: 'object',
  required: ['title', 'description', 'flashcards', 'quiz'],
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    flashcards: {
      type: 'array',
      items: {
        type: 'object', required: ['question', 'answer'], additionalProperties: false,
        properties: { question: { type: 'string' }, answer: { type: 'string' } }
      }
    },
    quiz: {
      type: 'array',
      items: {
        type: 'object', required: ['question', 'options', 'correctAnswer', 'explanation'], additionalProperties: false,
        properties: {
          question: { type: 'string' },
          options: { type: 'array', minItems: 4, maxItems: 4, items: { type: 'string' } },
          correctAnswer: { type: 'integer', minimum: 0, maximum: 3 },
          explanation: { type: 'string' }
        }
      }
    }
  }
};

// Kept as an alias so the Gemini adapter remains backwards compatible.
export const geminiResponseJsonSchema = studySetJsonSchema;
