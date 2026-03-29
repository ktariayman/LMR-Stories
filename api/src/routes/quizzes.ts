import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { QuizQuestion } from '../entities/QuizQuestion';
import { UserProgress } from '../entities/UserProgress';
import { Achievement } from '../entities/Achievement';
import { UserAchievement } from '../entities/UserAchievement';
import { cacheGet, cacheSet, cacheDel } from '../config/redis';
import { optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { quizSubmitSchema } from '../middleware/schemas';

const router = Router();

const SENTINEL_USER = '00000000-0000-0000-0000-000000000001';

// GET /api/stories/:id/quiz
router.get('/:id/quiz', async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const storyId = req.params.id as string;
    const cacheKey = `quiz:${storyId}:${language}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ data: cached });

    const questions = await AppDataSource.getRepository(QuizQuestion).find({
      where: { storyId, language: language as string },
      order: { sortOrder: 'ASC' },
    });

    const data = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
    }));

    await cacheSet(cacheKey, data);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stories/:id/quiz/submit
router.post('/:id/quiz/submit', optionalAuth, validate(quizSubmitSchema), async (req, res) => {
  try {
    const { answers, language = 'en' } = req.body;
    const storyId = req.params.id as string;
    const userId = req.user?.userId || SENTINEL_USER;

    const questions = await AppDataSource.getRepository(QuizQuestion).find({
      where: { storyId, language },
      order: { sortOrder: 'ASC' },
    });

    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctAnswer) correct++;
    }

    const total = questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = score === 100 ? 3 : score >= 66 ? 2 : score >= 33 ? 1 : 0;

    const progressRepo = AppDataSource.getRepository(UserProgress);
    let progress = await progressRepo.findOne({
      where: { userId, storyId, language },
    });

    if (progress) {
      progress.completed = true;
      progress.quizScore = score;
      progress.stars = stars;
      progress.completedAt = new Date();
    } else {
      progress = progressRepo.create({
        userId,
        storyId,
        language,
        completed: true,
        quizScore: score,
        stars,
        completedAt: new Date(),
      });
    }
    await progressRepo.save(progress);

    const newAchievements = await checkAchievements(userId);
    await cacheDel(`progress:${userId}:*`);

    res.json({ data: { correct, total, score, stars, new_achievements: newAchievements } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function checkAchievements(userId: string) {
  const earned: any[] = [];
  const progressRepo = AppDataSource.getRepository(UserProgress);

  const storiesCompleted = await progressRepo.count({ where: { userId, completed: true } });
  const perfectQuizzes = await progressRepo
    .createQueryBuilder('p')
    .where('p.user_id = :userId AND p.quiz_score = 100', { userId })
    .getCount();
  const languagesUsed = await progressRepo
    .createQueryBuilder('p')
    .select('COUNT(DISTINCT p.language)', 'c')
    .where('p.user_id = :userId AND p.completed = true', { userId })
    .getRawOne();

  const stats: Record<string, number> = {
    stories_completed: storiesCompleted,
    perfect_quizzes: perfectQuizzes,
    languages_used: parseInt(languagesUsed?.c || '0', 10),
  };

  const achievements = await AppDataSource.getRepository(Achievement).find();
  const uaRepo = AppDataSource.getRepository(UserAchievement);

  for (const ach of achievements) {
    const value = stats[ach.requirementType];
    if (value === undefined || value < ach.requirementValue) continue;
    const already = await uaRepo.findOne({ where: { userId, achievementId: ach.id } });
    if (!already) {
      await uaRepo.save(uaRepo.create({ userId, achievementId: ach.id }));
      earned.push({ slug: ach.slug, title: ach.title, emoji: ach.emoji });
    }
  }

  return earned;
}

export default router;
