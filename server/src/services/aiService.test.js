import { afterEach, describe, expect, it } from 'vitest';
import { generateStudySet, getProviderName } from './aiService.js';

const originalProvider = process.env.AI_PROVIDER;

afterEach(() => {
  if (originalProvider === undefined) delete process.env.AI_PROVIDER;
  else process.env.AI_PROVIDER = originalProvider;
});

describe('AI provider selection', () => {
  it('defaults to Groq', () => {
    delete process.env.AI_PROVIDER;
    expect(getProviderName()).toBe('groq');
  });

  it('rejects unsupported providers with a controlled error', async () => {
    process.env.AI_PROVIDER = 'unknown-provider';
    await expect(generateStudySet({})).rejects.toMatchObject({ code: 'AI_UNAVAILABLE', status: 503 });
  });
});
