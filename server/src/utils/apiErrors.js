export class ApiError extends Error {
  constructor(code, message, status, retryable = false, cause) {
    super(message, { cause });
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

export const safeError = (error) => {
  if (error instanceof ApiError) return error;
  const status = error?.status ?? error?.statusCode;
  if (status === 429) return new ApiError('AI_RATE_LIMIT', 'The AI service is busy. Please wait a moment and try again.', 429, true, error);
  if (status === 408 || /abort|timeout/i.test(error?.name || '')) return new ApiError('AI_TIMEOUT', 'The AI took too long to respond. Please try again.', 504, true, error);
  if (status === 401 || status === 403) return new ApiError('AI_UNAVAILABLE', 'The AI provider rejected its API credentials. Check the server configuration.', 503, false, error);
  if (status === 404) return new ApiError('AI_UNAVAILABLE', 'The configured AI model is unavailable.', 503, false, error);
  if (status === 400) return new ApiError('INVALID_AI_OUTPUT', 'The AI provider rejected the structured generation request.', 502, true, error);
  if (status >= 500) return new ApiError('AI_UNAVAILABLE', 'The AI service is temporarily unavailable.', 503, true, error);
  return new ApiError('SERVER_ERROR', 'Something went wrong while creating your study set.', 500, true, error);
};
