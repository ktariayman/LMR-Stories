import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { UserProgress } from '../entities/UserProgress';
import { UserAchievement } from '../entities/UserAchievement';
import { cacheGet, cacheSet, cacheDel } from '../config/redis';
import { optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { progressSaveSchema } from '../middleware/schemas';

const router = Router();

const SENTINEL_USER = '00000000-0000-0000-0000-000000000001';

function resolveUserId(req: any): string {
  return req.user?.userId || SENTINEL_USER;
}

// GET /api/progress
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = resolveUserId(req);

    const progress = await AppDataSource.getRepository(UserProgress)
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.story', 's')
      .leftJoin('s.translations', 't', 't.language = p.language')
      .addSelect(['t.title'])
      .where('p.user_id = :userId', { userId })
      .orderBy('p.completed_at', 'DESC')
      .getMany();

    res.json({ data: progress });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/stats
router.get('/stats', optionalAuth, async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const cacheKey = `progress:${userId}:stats`;

    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ data: cached });

    const progressRepo = AppDataSource.getRepository(UserProgress);

    const storiesCompleted = await progressRepo.count({ where: { userId, completed: true } });

    const perfectQuizzes = await progressRepo
      .createQueryBuilder('p')
      .where('p.user_id = :userId AND p.stars = 3', { userId })
      .getCount();

    const totalStarsResult = await progressRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.stars), 0)', 'total')
      .where('p.user_id = :userId', { userId })
      .getRawOne();

    const languagesResult = await progressRepo
      .createQueryBuilder('p')
      .select('COUNT(DISTINCT p.language)', 'c')
      .where('p.user_id = :userId AND p.completed = true', { userId })
      .getRawOne();

    const achievementsEarned = await AppDataSource.getRepository(UserAchievement).count({
      where: { userId },
    });

    const data = {
      stories_completed: storiesCompleted,
      perfect_quizzes: perfectQuizzes,
      total_stars: parseInt(totalStarsResult?.total || '0', 10),
      languages_used: parseInt(languagesResult?.c || '0', 10),
      achievements_earned: achievementsEarned,
    };

    await cacheSet(cacheKey, data, 60);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/progress  — save quiz result (upsert by user + story + language)
router.post('/', optionalAuth, validate(progressSaveSchema), async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { story_id, language, quiz_score, stars, completed } = req.body;

    const repo = AppDataSource.getRepository(UserProgress);

    // Check existing record
    let record = await repo.findOne({ where: { userId, storyId: story_id, language } });

    if (record) {
      // Only update if this attempt is better (more stars)
      if ((stars ?? 0) >= record.stars) {
        record.quizScore = quiz_score ?? record.quizScore;
        record.stars = stars ?? record.stars;
        record.completed = completed ?? record.completed;
        record.completedAt = new Date();
      }
    } else {
      record = repo.create({
        userId,
        storyId: story_id,
        language,
        quizScore: quiz_score ?? 0,
        stars: stars ?? 0,
        completed: completed ?? false,
        completedAt: new Date(),
      });
    }

    await repo.save(record);

    // Invalidate cached stats so Profile sees fresh data
    await cacheDel(`progress:${userId}:stats`);

    res.json({ data: record });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
