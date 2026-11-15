import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { generateRouter } from './routes/generateRoutes.js';
import { ApiError, safeError } from './utils/apiErrors.js';
import { logger } from './utils/logger.js';
import { randomUUID } from 'node:crypto';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    req.requestId = req.get('x-request-id') || randomUUID();
    res.set('x-request-id', req.requestId);
    const startedAt = Date.now();
    res.on('finish', () => logger.info('http.completed', {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - startedAt
    }));
    next();
  });
  app.use(cors());
  app.use(express.json({ limit: '32kb' }));
  app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/generate', generateRouter);
  app.use('/api/*path', (_req, _res, next) => next(new ApiError('INVALID_INPUT', 'API route not found.', 404, false)));
  app.use((error, _req, res, _next) => {
    const safe = error instanceof ApiError ? error : safeError(error);
    if (safe.status >= 500) logger.error('http.error_response', {
      requestId: _req.requestId,
      code: safe.code,
      status: safe.status,
      ...logger.providerError(error?.cause || error)
    });
    res.status(safe.status).json({
      success: false,
      error: { code: safe.code, message: safe.message, retryable: safe.retryable, requestId: _req.requestId }
    });
  });
  return app;
}
