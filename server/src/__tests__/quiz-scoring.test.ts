/**
 * Tests for the quiz scoring logic extracted from routes/quizzes.ts
 *
 * The scoring formula:
 *   score = Math.round((correct / total) * 100)
 *   stars = score === 100 ? 3 : score >= 66 ? 2 : score >= 33 ? 1 : 0
 */

function calculateScore(correct: number, total: number) {
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = score === 100 ? 3 : score >= 66 ? 2 : score >= 33 ? 1 : 0;
  return { score, stars };
}

function gradeAnswers(
  userAnswers: number[],
  correctAnswers: number[],
) {
  let correct = 0;
  for (let i = 0; i < correctAnswers.length; i++) {
    if (userAnswers[i] === correctAnswers[i]) correct++;
  }
  return { correct, total: correctAnswers.length };
}

describe('quiz scoring', () => {
  describe('calculateScore', () => {
    it('should return 100% and 3 stars for perfect score', () => {
      expect(calculateScore(3, 3)).toEqual({ score: 100, stars: 3 });
    });

    it('should return 2 stars for 66-99%', () => {
      expect(calculateScore(2, 3)).toEqual({ score: 67, stars: 2 });
    });

    it('should return 1 star for 33-65%', () => {
      expect(calculateScore(1, 3)).toEqual({ score: 33, stars: 1 });
    });

    it('should return 0 stars for below 33%', () => {
      expect(calculateScore(0, 3)).toEqual({ score: 0, stars: 0 });
    });

    it('should return 0 for empty quiz', () => {
      expect(calculateScore(0, 0)).toEqual({ score: 0, stars: 0 });
    });

    it('should handle single question', () => {
      expect(calculateScore(1, 1)).toEqual({ score: 100, stars: 3 });
      expect(calculateScore(0, 1)).toEqual({ score: 0, stars: 0 });
    });

    it('should handle 5 questions', () => {
      expect(calculateScore(5, 5)).toEqual({ score: 100, stars: 3 });
      expect(calculateScore(4, 5)).toEqual({ score: 80, stars: 2 });
      expect(calculateScore(2, 5)).toEqual({ score: 40, stars: 1 });
      expect(calculateScore(1, 5)).toEqual({ score: 20, stars: 0 });
    });
  });

  describe('gradeAnswers', () => {
    it('should handle all correct', () => {
      const result = gradeAnswers([0, 1, 2], [0, 1, 2]);
      expect(result).toEqual({ correct: 3, total: 3 });
    });

    it('should handle all wrong', () => {
      const result = gradeAnswers([3, 3, 3], [0, 1, 2]);
      expect(result).toEqual({ correct: 0, total: 3 });
    });

    it('should handle partial correct', () => {
      const result = gradeAnswers([0, 3, 2], [0, 1, 2]);
      expect(result).toEqual({ correct: 2, total: 3 });
    });

    it('should handle partial answers (fewer than questions)', () => {
      const result = gradeAnswers([0], [0, 1, 2]);
      expect(result.correct).toBe(1);
      expect(result.total).toBe(3);
    });
  });
});
