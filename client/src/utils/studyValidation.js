const modes = ['flashcards', 'quiz', 'both'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

export function isStudyData(value) {
  if (!value || typeof value !== 'object' || typeof value.title !== 'string' || typeof value.description !== 'string') return false;
  if (!Array.isArray(value.flashcards) || !Array.isArray(value.quiz)) return false;
  const ids = new Set();
  const cardOk = value.flashcards.every((card) => card && typeof card.id === 'string' && typeof card.question === 'string' && card.question.trim() && typeof card.answer === 'string' && card.answer.trim() && !ids.has(card.id) && ids.add(card.id));
  const quizOk = value.quiz.every((q) => q && typeof q.id === 'string' && typeof q.question === 'string' && q.question.trim() && Array.isArray(q.options) && q.options.length === 4 && q.options.every((option) => typeof option === 'string' && option.trim()) && Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer <= 3 && typeof q.explanation === 'string' && q.explanation.trim() && !ids.has(q.id) && ids.add(q.id));
  return Boolean(cardOk && quizOk);
}

export function isSavedSession(value) {
  return Boolean(value && typeof value.id === 'string' && typeof value.createdAt === 'string' && modes.includes(value.mode) && difficulties.includes(value.difficulty) && isStudyData(value));
}

export function validateApiPayload(payload) {
  if (!payload?.success || !isStudyData(payload.data)) throw new Error('The server returned an invalid study set.');
  return payload.data;
}
