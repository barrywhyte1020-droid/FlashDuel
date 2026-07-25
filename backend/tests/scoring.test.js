const { computeScore } = require('../src/scoring');

describe('computeScore', () => {
  test('returns zeroed result for an empty answer set', () => {
    expect(computeScore([])).toEqual({ score: 0, accuracy: 0, avgResponseTimeMs: 0 });
  });

  test('awards 100 base points per correct answer', () => {
    const answers = [
      { correct: true, responseTimeMs: 15000 }, // at the limit -> 0 speed bonus
      { correct: true, responseTimeMs: 15000 },
    ];
    const result = computeScore(answers);
    expect(result.score).toBe(200);
    expect(result.accuracy).toBe(1);
  });

  test('gives no points for wrong answers, regardless of speed', () => {
    const answers = [{ correct: false, responseTimeMs: 100 }];
    const result = computeScore(answers);
    expect(result.score).toBe(0);
    expect(result.accuracy).toBe(0);
  });

  test('rewards faster correct answers with a larger speed bonus', () => {
    const fast = computeScore([{ correct: true, responseTimeMs: 0 }]);
    const slow = computeScore([{ correct: true, responseTimeMs: 15000 }]);
    expect(fast.score).toBeGreaterThan(slow.score);
    expect(fast.score).toBe(120); // 100 base + max 20 bonus
    expect(slow.score).toBe(100); // 100 base + 0 bonus at the time limit
  });

  test('computes accuracy as correct/total, independent of speed', () => {
    const answers = [
      { correct: true, responseTimeMs: 5000 },
      { correct: false, responseTimeMs: 5000 },
      { correct: true, responseTimeMs: 5000 },
      { correct: false, responseTimeMs: 5000 },
    ];
    expect(computeScore(answers).accuracy).toBe(0.5);
  });

  test('computes the average response time across all answers', () => {
    const answers = [
      { correct: true, responseTimeMs: 1000 },
      { correct: false, responseTimeMs: 3000 },
    ];
    expect(computeScore(answers).avgResponseTimeMs).toBe(2000);
  });

  test('a player who is faster but less accurate can still lose on score', () => {
    // 1 correct, blazing fast vs 3 correct, comfortably paced
    const fastButWrong = computeScore([
      { correct: true, responseTimeMs: 0 },
      { correct: false, responseTimeMs: 0 },
      { correct: false, responseTimeMs: 0 },
    ]);
    const accurate = computeScore([
      { correct: true, responseTimeMs: 8000 },
      { correct: true, responseTimeMs: 8000 },
      { correct: true, responseTimeMs: 8000 },
    ]);
    expect(accurate.score).toBeGreaterThan(fastButWrong.score);
  });
});
