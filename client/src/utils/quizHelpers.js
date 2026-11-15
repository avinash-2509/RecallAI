export function scoreQuiz(questions, answers) {
  const correct = questions.reduce((total, q) => total + (answers[q.id] === q.correctAnswer ? 1 : 0), 0);
  return { correct, incorrect: questions.length - correct, total: questions.length, percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0 };
}

export function incorrectQuestions(questions, answers) {
  return questions.filter((q) => answers[q.id] !== q.correctAnswer);
}

export function resultMessage(score) {
  if (score >= 90) return "Excellent work! You've mastered this topic.";
  if (score >= 70) return 'Great progress! A little more practice will help.';
  return 'Keep practicing! Every attempt helps you improve.';
}
