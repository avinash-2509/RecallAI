import { isSavedSession } from './studyValidation.js';

export const STORAGE_KEY = 'recallai:sessions:v1';

export function parseStoredSessions(raw) {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter(isSavedSession) : [];
  } catch { return []; }
}

export function loadSessions(storage = globalThis.localStorage) {
  try { return parseStoredSessions(storage.getItem(STORAGE_KEY)); }
  catch { return []; }
}

export function writeSessions(sessions, storage = globalThis.localStorage) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(sessions)); return { ok: true }; }
  catch { return { ok: false, message: 'This study set could not be saved in your browser.' }; }
}
