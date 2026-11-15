import Groq from 'groq-sdk';
import { parseAndNormalizeStudySet, studySetJsonSchema } from '../schemas/studySchema.js';
import { buildPrompt, systemInstruction } from '../utils/promptBuilder.js';
import { ApiError, safeError } from '../utils/apiErrors.js';

export async function generateWithGroq(request, { signal } = {}) {
  if (!process.env.GROQ_API_KEY) {
    throw new ApiError('AI_UNAVAILABLE', 'Groq is selected but GROQ_API_KEY is not configured.', 503, false);
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const requestedItems = request.count * (request.mode === 'both' ? 2 : 1);
  const maxCompletionTokens = Math.min(7000, 1000 + (requestedItems * 160));
  const baseRequest = {
    model: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: buildPrompt(request) }
    ],
    temperature: 0.3,
    reasoning_effort: 'none',
    max_completion_tokens: maxCompletionTokens
  };

  try {
    let completion;
    try {
      completion = await client.chat.completions.create({
        ...baseRequest,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'recall_ai_study_set',
            strict: true,
            schema: studySetJsonSchema
          }
        }
      }, { signal });
    } catch (error) {
      const status = error?.status ?? error?.statusCode;
      if (status !== 400) throw error;
      completion = await client.chat.completions.create({
        ...baseRequest,
        response_format: { type: 'json_object' }
      }, { signal });
    }

    const content = completion.choices?.[0]?.message?.content;
    return parseAndNormalizeStudySet(content, request);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw safeError(error);
  }
}
