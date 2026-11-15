import { GoogleGenAI } from '@google/genai';
import { geminiResponseJsonSchema, parseAndNormalizeStudySet } from '../schemas/studySchema.js';
import { buildPrompt, systemInstruction } from '../utils/promptBuilder.js';
import { ApiError, safeError } from '../utils/apiErrors.js';

export async function generateStudySet(request, { signal } = {}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new ApiError('AI_UNAVAILABLE', 'AI generation is not configured on this server.', 503, false);
  }
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
      contents: buildPrompt(request),
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseJsonSchema: geminiResponseJsonSchema,
        temperature: 0.35,
        abortSignal: signal
      }
    });
    return parseAndNormalizeStudySet(response.text, request);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw safeError(error);
  }
}
