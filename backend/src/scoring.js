// Score = accuracy-weighted points, with a speed bonus for fast correct answers.
// Tuned so accuracy dominates (a duel isn't won by rushing wrong answers),
// but a tie on accuracy is broken by speed.
function computeScore(answers) {
  if (!answers.length) return { score: 0, accuracy: 0, avgResponseTimeMs: 0 };

  const correctCount = answers.filter((a) => a.correct).length;
  const accuracy = correctCount / answers.length;

  const totalTime = answers.reduce((sum, a) => sum + a.responseTimeMs, 0);
  const avgResponseTimeMs = Math.round(totalTime / answers.length);

  const basePoints = correctCount * 100;
  // Speed bonus only applies to correct answers: up to 20 bonus points per
  // card for answering well inside the time limit, decaying to 0 at the limit.
  const speedBonus = answers.reduce((sum, a) => {
    if (!a.correct) return sum;
    const limitMs = 15000;
    const bonus = Math.max(0, Math.round((1 - a.responseTimeMs / limitMs) * 20));
    return sum + bonus;
  }, 0);

  return {
    score: basePoints + speedBonus,
    accuracy: Number(accuracy.toFixed(2)),
    avgResponseTimeMs,
  };
}

module.exports = { computeScore };
