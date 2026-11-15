import { Router } from 'express';
import { generateRequestSchema } from '../schemas/studySchema.js';
import { generateStudySet, getProviderName } from '../services/aiService.js';
import { ApiError } from '../utils/apiErrors.js';
import { logger } from '../utils/logger.js';

export const generateRouter = Router();

generateRouter.post('/', async (req, res, next) => {
  const parsed = generateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.warn('generation.input_invalid', {
      requestId: req.requestId,
      issues: parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), code: issue.code }))
    });
    return next(new ApiError('INVALID_INPUT', 'Check your topic and generation options, then try again.', 400, false));
  }

  const controller = new AbortController();
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 20000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  req.on('aborted', () => controller.abort());
  res.on('close', () => { if (!res.writableEnded) controller.abort(); });
  const provider = getProviderName();
  const startedAt = Date.now();

  logger.info('generation.started', {
    requestId: req.requestId,
    provider,
    model: provider === 'groq' ? process.env.GROQ_MODEL : process.env.GEMINI_MODEL,
    mode: parsed.data.mode,
    difficulty: parsed.data.difficulty,
    count: parsed.data.count,
    inputCharacters: parsed.data.input.length,
    timeoutMs
  });

  try {
    const data = await generateStudySet(parsed.data, { signal: controller.signal });
    logger.info('generation.completed', {
      requestId: req.requestId,
      provider,
      durationMs: Date.now() - startedAt,
      flashcards: data.flashcards.length,
      quizQuestions: data.quiz.length
    });
    if (!res.writableEnded) res.json({ success: true, data, meta: { requestId: req.requestId, provider } });
  } catch (error) {
    logger.error('generation.failed', {
      requestId: req.requestId,
      provider,
      durationMs: Date.now() - startedAt,
      code: error?.code,
      ...logger.providerError(error?.cause || error)
    });
    next(error);
  } finally {
    clearTimeout(timeout);
  }
});
