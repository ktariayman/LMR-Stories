import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { Achievement } from '../entities/Achievement';
import { UserAchievement } from '../entities/UserAchievement';
import { cacheGet, cacheSet } from '../config/redis';
import { optionalAuth } from '../middleware/auth';

const router = Router();

const SENTINEL_USER = '00000000-0000-0000-0000-000000000001';

// GET /api/achievements
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.userId || SENTINEL_USER;
    const cacheKey = `achievements:${userId}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ data: cached });

    const achievements = await AppDataSource.getRepository(Achievement).find({
      order: { requirementValue: 'ASC' },
    });

    const userAchievements = await AppDataSource.getRepository(UserAchievement).find({
      where: { userId },
    });
    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    const data = achievements.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      emoji: a.emoji,
      requirement_type: a.requirementType,
      requirement_value: a.requirementValue,
      unlocked: unlockedIds.has(a.id),
      earned_at: userAchievements.find((ua) => ua.achievementId === a.id)?.earnedAt || null,
    }));

    await cacheSet(cacheKey, data, 120);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
