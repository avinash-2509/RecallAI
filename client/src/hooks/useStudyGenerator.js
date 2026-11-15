import { useEffect, useRef, useState } from 'react';
import { requestStudySet } from '../services/studyApi.js';
import { validateApiPayload } from '../utils/studyValidation.js';

export const isLatestRequest = (sequence, candidate) => sequence.current === candidate;

export function useStudyGenerator(onSuccess) {
  const [state, setState] = useState({ status: 'idle', error: null });
  const sequence = useRef(0);
  const controller = useRef(null);
  const lastRequest = useRef(null);

  const generate = async (request) => {
    controller.current?.abort();
    const id = ++sequence.current;
    const currentController = new AbortController();
    controller.current = currentController;
    lastRequest.current = request;
    setState({ status: 'loading', error: null });
    try {
      const payload = await requestStudySet(request, currentController.signal);
      if (!isLatestRequest(sequence, id)) return;
      const data = validateApiPayload(payload);
      setState({ status: 'success', error: null });
      onSuccess(data, request);
    } catch (error) {
      if (!isLatestRequest(sequence, id) || error?.name === 'AbortError') return;
      setState({ status: 'error', error: { message: error?.message || 'We could not create your study set.', retryable: error?.retryable !== false } });
    } finally {
      if (isLatestRequest(sequence, id)) controller.current = null;
    }
  };

  const cancel = () => {
    sequence.current += 1;
    controller.current?.abort();
    controller.current = null;
    setState({ status: 'idle', error: null });
  };
  const retry = () => lastRequest.current && generate(lastRequest.current);

  useEffect(() => () => { sequence.current += 1; controller.current?.abort(); }, []);
  return { ...state, generate, cancel, retry, reset: () => setState({ status: 'idle', error: null }) };
}
