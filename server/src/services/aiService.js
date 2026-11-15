import { generateStudySet as generateWithGemini } from './geminiService.js';
import { generateWithGroq } from './groqService.js';
import { ApiError } from '../utils/apiErrors.js';

export function getProviderName() {
  return (process.env.AI_PROVIDER || 'groq').trim().toLowerCase();
}

export async function generateStudySet(request, options) {
  const provider = getProviderName();
  if (provider === 'groq') return generateWithGroq(request, options);
  if (provider === 'gemini') return generateWithGemini(request, options);
  throw new ApiError('AI_UNAVAILABLE', `Unsupported AI provider: ${provider}`, 503, false);
}
