const API_URL = import.meta.env.VITE_API_URL || '';

export async function requestStudySet(request, signal) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/generate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), signal
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('[RecallAI] Network request failed', { name: error.name, message: error.message });
    throw { code: 'NETWORK_ERROR', message: 'We could not reach the server. Check your connection and try again.', retryable: true };
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const apiError = payload?.error || { code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.', retryable: true };
    console.error('[RecallAI] Generation failed', {
      status: response.status,
      code: apiError.code,
      requestId: apiError.requestId,
      message: apiError.message
    });
    throw apiError;
  }
  return payload;
}
