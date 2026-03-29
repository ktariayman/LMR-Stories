import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { Story } from '../entities/Story';
import { StoryTranslation } from '../entities/StoryTranslation';
import { QuizQuestion } from '../entities/QuizQuestion';
import { generateStory, translateStory } from '../services/ai';
import { synthesizeSpeech } from '../services/tts';
import { cacheDel } from '../config/redis';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generateStorySchema, translateSchema } from '../middleware/schemas';

const router = Router();

// POST /api/generate/story
router.post('/story', requireAuth, validate(generateStorySchema), async (req, res) => {
  try {
    const { theme = 'adventure', difficulty = 'easy', age_group = '5-7', language = 'en', is_public = false } = req.body;

    if (!process.env.GROQ_API_KEY && !process.env.OLLAMA_URL) {
      return res.status(400).json({ error: 'No AI provider configured. Set GROQ_API_KEY or OLLAMA_URL.' });
    }

    const generated = await generateStory({ theme, difficulty, age_group, language });

    const authorId = req.user!.userId;

    // Save to database
    const storyRepo = AppDataSource.getRepository(Story);
    const story = storyRepo.create({
      slug: `ai-${theme}-${Date.now()}`,
      difficulty: difficulty as any,
      ageGroup: age_group as any,
      theme,
      themeEmoji: generated.theme_emoji || '✨',
      isAiGenerated: true,
      storyType: 'community',
      authorId,
      isPublic: Boolean(is_public),
    });
    const savedStory = await storyRepo.save(story);

    const trans = AppDataSource.getRepository(StoryTranslation).create({
      storyId: savedStory.id,
      language,
      title: generated.title,
      content: generated.content,
      summary: generated.summary,
    });

    // Generate high-quality human audio
    try {
      const audioBase64 = await synthesizeSpeech({
        text: generated.content,
        language
      });
      trans.audioContent = audioBase64;
    } catch (audioErr) {
      console.error('Audio generation failed:', audioErr);
    }

    await AppDataSource.getRepository(StoryTranslation).save(trans);

    const quizRepo = AppDataSource.getRepository(QuizQuestion);
    for (let i = 0; i < generated.quiz.length; i++) {
      const q = quizRepo.create({
        storyId: savedStory.id,
        language,
        question: generated.quiz[i].question,
        options: generated.quiz[i].options,
        correctAnswer: generated.quiz[i].correct_answer,
        sortOrder: i,
      });
      await quizRepo.save(q);
    }

    await cacheDel('stories:*');

    // Respond immediately — user doesn't wait for translations
    res.json({
      data: {
        id: savedStory.id,
        slug: savedStory.slug,
        title: generated.title,
        content: generated.content,
        summary: generated.summary,
        quiz: generated.quiz,
      },
    });

    // Fire-and-forget: auto-translate to other languages in background
    const storyId = savedStory.id;
    const sourceQuiz = generated.quiz;
    setImmediate(async () => {
      const ALL_LANGUAGES = ['en', 'fr', 'ar'];
      const otherLanguages = ALL_LANGUAGES.filter((l) => l !== language);
      for (const targetLang of otherLanguages) {
        try {
          const translated = await translateStory({
            title: generated.title,
            content: generated.content,
            summary: generated.summary,
            quiz: sourceQuiz.map((q: any) => ({
              question: q.question, options: q.options, correct_answer: q.correct_answer,
            })),
            source_language: language,
            target_language: targetLang,
          });

          const tRepo = AppDataSource.getRepository(StoryTranslation);
          await tRepo.save(tRepo.create({
            storyId, language: targetLang,
            title: translated.title, content: translated.content, summary: translated.summary,
          }));

          const qRepo = AppDataSource.getRepository(QuizQuestion);
          for (let i = 0; i < translated.quiz.length; i++) {
            await qRepo.save(qRepo.create({
              storyId, language: targetLang,
              question: translated.quiz[i].question, options: translated.quiz[i].options,
              correctAnswer: translated.quiz[i].correct_answer, sortOrder: i,
            }));
          }
          console.log(`Auto-translated story ${storyId} → ${targetLang}`);
        } catch (err) {
          console.error(`Failed to auto-translate to ${targetLang}:`, err);
        }
      }
      await cacheDel('stories:*');
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/generate/translate
router.post('/translate', requireAuth, validate(translateSchema), async (req, res) => {
  try {
    const { story_id, target_language } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({ error: 'No AI provider configured. Set GROQ_API_KEY or OLLAMA_URL.' });
    }

    const existing = await AppDataSource.getRepository(StoryTranslation).findOne({
      where: { storyId: story_id },
    });
    if (!existing) return res.status(404).json({ error: 'Story not found' });

    const existingQuiz = await AppDataSource.getRepository(QuizQuestion).find({
      where: { storyId: story_id, language: existing.language },
      order: { sortOrder: 'ASC' },
    });

    const translated = await translateStory({
      title: existing.title,
      content: existing.content,
      summary: existing.summary,
      quiz: existingQuiz.map((q) => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
      })),
      source_language: existing.language,
      target_language,
    });

    // Save translation (upsert)
    const transRepo = AppDataSource.getRepository(StoryTranslation);
    let trans = await transRepo.findOne({
      where: { storyId: story_id, language: target_language },
    });
    if (trans) {
      trans.title = translated.title;
      trans.content = translated.content;
      trans.summary = translated.summary;
    } else {
      trans = transRepo.create({
        storyId: story_id,
        language: target_language,
        title: translated.title,
        content: translated.content,
        summary: translated.summary,
      });
    }
    await transRepo.save(trans);

    // Replace quiz for target language
    await AppDataSource.getRepository(QuizQuestion).delete({
      storyId: story_id,
      language: target_language,
    });
    const quizRepo = AppDataSource.getRepository(QuizQuestion);
    for (let i = 0; i < translated.quiz.length; i++) {
      await quizRepo.save(quizRepo.create({
        storyId: story_id,
        language: target_language,
        question: translated.quiz[i].question,
        options: translated.quiz[i].options,
        correctAnswer: translated.quiz[i].correct_answer,
        sortOrder: i,
      }));
    }

    await cacheDel('stories:*');
    res.json({ data: translated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
