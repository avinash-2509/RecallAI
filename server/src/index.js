import 'dotenv/config';
import { createApp } from './app.js';
import { getProviderName } from './services/aiService.js';
import { logger } from './utils/logger.js';

const port = Number(process.env.PORT) || 5000;
createApp().listen(port, () => logger.info('server.started', {
  port,
  provider: getProviderName(),
  model: getProviderName() === 'groq' ? (process.env.GROQ_MODEL || 'qwen/qwen3.8-27b') : (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'),
  timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 20000
}));
