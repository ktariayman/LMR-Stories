import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { Story } from '../entities/Story';
import { StoryTranslation } from '../entities/StoryTranslation';
import { QuizQuestion } from '../entities/QuizQuestion';
import { StoryVote } from '../entities/StoryVote';
import { cacheGet, cacheSet, cacheDel } from '../config/redis';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createStorySchema, updateStorySchema } from '../middleware/schemas';

const router = Router();

// GET /api/stories — list stories with optional filters
// ?feed=community  → public community stories sorted by vote_count
// ?story_type=official|community
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { language = 'en', difficulty, age_group, theme, feed, story_type, author } = req.query;
    const userId = req.user?.userId;
    const isCommunityFeed = feed === 'community';
    const isMyStories = author === 'me';

    // Skip cache for per-user queries
    const cacheKey = isMyStories
      ? null
      : `stories:list:${language}:${difficulty || ''}:${age_group || ''}:${theme || ''}:${feed || ''}:${story_type || ''}`;

    if (cacheKey) {
      const cached = await cacheGet(cacheKey);
      if (cached) {
        if (userId && Array.isArray(cached)) {
          const voteRepo = AppDataSource.getRepository(StoryVote);
          const storyIds = (cached as any[]).map((s: any) => s.id);
          const votes = storyIds.length > 0
            ? await voteRepo.createQueryBuilder('v')
                .where('v.user_id = :userId AND v.story_id IN (:...ids)', { userId, ids: storyIds })
                .getMany()
            : [];
          const votedSet = new Set(votes.map((v) => v.storyId));
          return res.json({ data: (cached as any[]).map((s: any) => ({ ...s, user_has_voted: votedSet.has(s.id) })) });
        }
        return res.json({ data: cached });
      }
    }

    const qb = AppDataSource.getRepository(Story)
      .createQueryBuilder('s')
      // Load ALL translations — we pick the right language in the mapping below
      .leftJoinAndSelect('s.translations', 't')
      .leftJoin('s.author', 'u')
      .addSelect(['u.username', 'u.displayName']);

    if (isMyStories) {
      if (!userId) return res.json({ data: [] });
      qb.where('s.author_id = :userId', { userId });
      qb.orderBy('s.createdAt', 'DESC');
    } else if (isCommunityFeed) {
      qb.where('s.story_type = :type AND s.is_public = true', { type: 'community' });
      qb.orderBy('s.vote_count', 'DESC').addOrderBy('s.createdAt', 'DESC');
    } else {
      const type = (story_type as string) || 'official';
      qb.where('s.story_type = :type', { type });
      qb.orderBy('s.createdAt', 'DESC');
    }

    if (difficulty) qb.andWhere('s.difficulty = :difficulty', { difficulty });
    if (age_group) qb.andWhere('s.ageGroup = :age_group', { age_group });
    if (theme) qb.andWhere('s.theme = :theme', { theme });

    const stories = await qb.getMany();

    const data = stories.map((s) => {
      // Pick translation in requested language, fall back to English, then first available
      const trans = s.translations.find((t) => t.language === language)
        || s.translations.find((t) => t.language === 'en')
        || s.translations[0];
      return {
        id: s.id,
        slug: s.slug,
        difficulty: s.difficulty,
        age_group: s.ageGroup,
        theme: s.theme,
        theme_emoji: s.themeEmoji,
        is_ai_generated: s.isAiGenerated,
        story_type: s.storyType,
        author_id: s.authorId,
        author_username: s.author?.username || null,
        is_public: s.isPublic,
        vote_count: s.voteCount,
        cover_image: s.coverImage || null,
        title: trans?.title || s.slug,
        summary: trans?.summary || '',
        audio_content: trans?.audioContent || null,
        language: trans?.language || language,
        user_has_voted: false,
      };
    });

    if (cacheKey) await cacheSet(cacheKey, data);

    // Inject user vote status
    if (userId && data.length > 0) {
      const voteRepo = AppDataSource.getRepository(StoryVote);
      const votes = await voteRepo.createQueryBuilder('v')
        .where('v.user_id = :userId AND v.story_id IN (:...ids)', { userId, ids: data.map((s) => s.id) })
        .getMany();
      const votedSet = new Set(votes.map((v) => v.storyId));
      return res.json({ data: data.map((s) => ({ ...s, user_has_voted: votedSet.has(s.id) })) });
    }

    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stories/:id — single story with translation + quiz
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const id = req.params.id as string;
    const cacheKey = `stories:detail:${id}:${language}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ data: cached });

    const story = await AppDataSource.getRepository(Story).findOne({
      where: { id },
      relations: ['translations', 'author'],
    });
    if (!story) return res.status(404).json({ error: 'Story not found' });

    // Private community stories only accessible to author
    if (!story.isPublic && story.storyType === 'community') {
      if (!req.user || req.user.userId !== story.authorId) {
        return res.status(403).json({ error: 'This story is private' });
      }
    }

    // Pick best translation: requested language → English fallback → first available
    const translation = story.translations.find((t) => t.language === language)
      || story.translations.find((t) => t.language === 'en')
      || story.translations[0];

    // Use the actual translation language for quiz (not the requested one)
    const quizLang = translation?.language || language;
    let quiz = await AppDataSource.getRepository(QuizQuestion).find({
      where: { storyId: id as string, language: quizLang as string },
      order: { sortOrder: 'ASC' },
    });
    // If no quiz in this language, try English quiz as fallback
    if (quiz.length === 0 && quizLang !== 'en') {
      quiz = await AppDataSource.getRepository(QuizQuestion).find({
        where: { storyId: id as string, language: 'en' },
        order: { sortOrder: 'ASC' },
      });
    }

    const availableLanguages = story.translations.map((t) => t.language);

    const data = {
      id: story.id,
      slug: story.slug,
      difficulty: story.difficulty,
      age_group: story.ageGroup,
      theme: story.theme,
      theme_emoji: story.themeEmoji,
      is_ai_generated: story.isAiGenerated,
      story_type: story.storyType,
      author_id: story.authorId,
      author_username: story.author?.username || null,
      is_public: story.isPublic,
      vote_count: story.voteCount,
      cover_image: story.coverImage || null,
      title: translation?.title || story.slug,
      content: translation?.content || '',
      summary: translation?.summary || '',
      language: translation?.language || language,
      available_languages: availableLanguages,
      quiz: quiz.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
      })),
      audio_content: translation?.audioContent || null,
    };

    await cacheSet(cacheKey, data);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stories — create a community story (auth required)
router.post('/', requireAuth, validate(createStorySchema), async (req, res) => {
  try {
    const { slug, difficulty, age_group, theme, theme_emoji, is_public = true, translations, quiz } = req.body;

    const story = new Story();
    story.slug = slug || `community-${Date.now()}`;
    story.difficulty = difficulty;
    story.ageGroup = age_group;
    story.theme = theme;
    story.themeEmoji = theme_emoji || '📖';
    story.storyType = 'community';
    story.authorId = req.user!.userId;
    story.isPublic = is_public;
    story.isAiGenerated = false;

    const savedStory = await AppDataSource.getRepository(Story).save(story);

    if (translations) {
      for (const t of translations) {
        const trans = new StoryTranslation();
        trans.storyId = savedStory.id;
        trans.language = t.language;
        trans.title = t.title;
        trans.content = t.content;
        trans.summary = t.summary || '';
        await AppDataSource.getRepository(StoryTranslation).save(trans);
      }
    }

    if (quiz) {
      for (let i = 0; i < quiz.length; i++) {
        const q = new QuizQuestion();
        q.storyId = savedStory.id;
        q.language = quiz[i].language;
        q.question = quiz[i].question;
        q.options = quiz[i].options;
        q.correctAnswer = quiz[i].correct_answer;
        q.sortOrder = i;
        await AppDataSource.getRepository(QuizQuestion).save(q);
      }
    }

    await cacheDel('stories:list:*');
    res.status(201).json({ data: { id: savedStory.id, slug: savedStory.slug } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/stories/:id — update visibility (owner only)
router.patch('/:id', requireAuth, validate(updateStorySchema), async (req, res) => {
  try {
    const id = req.params.id as string;
    const storyRepo = AppDataSource.getRepository(Story);
    const story = await storyRepo.findOne({ where: { id } });
    if (!story) return res.status(404).json({ error: 'Story not found' });
    if (story.authorId !== req.user!.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { is_public, theme_emoji } = req.body;
    if (typeof is_public === 'boolean') story.isPublic = is_public;
    if (theme_emoji) story.themeEmoji = theme_emoji;
    await storyRepo.save(story);

    await cacheDel(`stories:detail:${id}:*`);
    await cacheDel('stories:list:*');
    res.json({ data: { id: story.id, is_public: story.isPublic } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/stories/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id as string;
    const storyRepo = AppDataSource.getRepository(Story);
    const story = await storyRepo.findOne({ where: { id } });
    if (!story) return res.status(404).json({ error: 'Story not found' });
    if (story.storyType === 'community' && story.authorId !== req.user!.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await storyRepo.delete(id);
    await cacheDel('stories:*');
    res.json({ data: { deleted: true } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
