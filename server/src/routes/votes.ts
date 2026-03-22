import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { Story } from '../entities/Story';
import { StoryVote } from '../entities/StoryVote';
import { requireAuth } from '../middleware/auth';
import { cacheDel } from '../config/redis';

const router = Router();

// POST /api/stories/:id/vote
router.post('/:id/vote', requireAuth, async (req, res) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const storyRepo = AppDataSource.getRepository(Story);
    const story = await storyRepo.findOne({ where: { id } });
    if (!story) return res.status(404).json({ error: 'Story not found' });

    const voteRepo = AppDataSource.getRepository(StoryVote);
    const existing = await voteRepo.findOne({ where: { userId, storyId: id } });
    if (existing) {
      return res.status(409).json({ error: 'Already voted' });
    }

    const vote = voteRepo.create({ userId, storyId: id, value: 1 });
    await voteRepo.save(vote);

    await storyRepo.increment({ id }, 'voteCount', 1);
    const updated = await storyRepo.findOne({ where: { id } });

    await cacheDel(`stories:detail:${id}:*`);
    await cacheDel('stories:list:*');

    res.json({ data: { vote_count: updated!.voteCount, user_has_voted: true } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/stories/:id/vote
router.delete('/:id/vote', requireAuth, async (req, res) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const voteRepo = AppDataSource.getRepository(StoryVote);
    const vote = await voteRepo.findOne({ where: { userId, storyId: id } });
    if (!vote) return res.status(404).json({ error: 'Vote not found' });

    await voteRepo.remove(vote);

    const storyRepo = AppDataSource.getRepository(Story);
    await storyRepo.decrement({ id }, 'voteCount', 1);
    const updated = await storyRepo.findOne({ where: { id } });

    await cacheDel(`stories:detail:${id}:*`);
    await cacheDel('stories:list:*');

    res.json({ data: { vote_count: Math.max(0, updated!.voteCount), user_has_voted: false } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
