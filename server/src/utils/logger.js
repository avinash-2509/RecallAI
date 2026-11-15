const redact = (value) => {
  if (!value) return undefined;
  return String(value)
    .replace(/AIza[\w-]+/g, '[REDACTED_GOOGLE_KEY]')
    .replace(/gsk_[\w-]+/g, '[REDACTED_GROQ_KEY]')
    .slice(0, 500);
};

function write(level, event, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...Object.fromEntries(Object.entries(details).filter(([, value]) => value !== undefined))
  };
  const output = JSON.stringify(entry);
  if (level === 'error') console.error(output);
  else if (level === 'warn') console.warn(output);
  else console.log(output);
}

export const logger = {
  info: (event, details) => write('info', event, details),
  warn: (event, details) => write('warn', event, details),
  error: (event, details) => write('error', event, details),
  providerError(error) {
    return {
      providerStatus: error?.status ?? error?.statusCode,
      providerCode: redact(error?.code),
      providerError: redact(error?.name),
      providerMessage: redact(error?.message)
    };
  }
};
