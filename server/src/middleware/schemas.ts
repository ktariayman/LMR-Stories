import { z } from 'zod';

const LANGUAGES = ['en', 'fr', 'ar'] as const;
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const AGE_GROUPS = ['5-7', '8-10'] as const;

// Auth
export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be 3-30 characters')
    .max(30, 'Username must be 3-30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  display_name: z.string().max(50).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Generate
export const generateStorySchema = z.object({
  theme: z.string().min(1).max(50).default('adventure'),
  difficulty: z.enum(DIFFICULTIES).default('easy'),
  age_group: z.enum(AGE_GROUPS).default('5-7'),
  language: z.enum(LANGUAGES).default('en'),
  is_public: z.boolean().default(false),
});

export const translateSchema = z.object({
  story_id: z.string().uuid('Invalid story ID'),
  target_language: z.enum(LANGUAGES),
});

// Quiz submit
export const quizSubmitSchema = z.object({
  answers: z.array(z.number().int().min(0).max(3)),
  language: z.enum(LANGUAGES).default('en'),
});

// Progress
export const progressSaveSchema = z.object({
  story_id: z.string().uuid('Invalid story ID'),
  language: z.enum(LANGUAGES),
  quiz_score: z.number().int().min(0).max(100).optional(),
  stars: z.number().int().min(0).max(3).optional(),
  completed: z.boolean().optional(),
});

// Story creation
export const createStorySchema = z.object({
  slug: z.string().max(100).optional(),
  difficulty: z.enum(DIFFICULTIES),
  age_group: z.enum(AGE_GROUPS),
  theme: z.string().min(1).max(50),
  theme_emoji: z.string().max(10).optional(),
  is_public: z.boolean().default(true),
  translations: z.array(z.object({
    language: z.enum(LANGUAGES),
    title: z.string().min(1).max(200),
    content: z.string().min(1).max(50000),
    summary: z.string().max(500).optional(),
  })).min(1, 'At least one translation is required'),
  quiz: z.array(z.object({
    language: z.enum(LANGUAGES),
    question: z.string().min(1).max(500),
    options: z.array(z.string().min(1).max(200)).length(4),
    correct_answer: z.number().int().min(0).max(3),
  })).optional(),
});

// Story update
export const updateStorySchema = z.object({
  is_public: z.boolean().optional(),
  theme_emoji: z.string().max(10).optional(),
}).refine((data) => data.is_public !== undefined || data.theme_emoji !== undefined, {
  message: 'At least one field to update is required',
});

// Query params
export const storyListQuerySchema = z.object({
  language: z.enum(LANGUAGES).default('en'),
  difficulty: z.enum(DIFFICULTIES).optional(),
  age_group: z.enum(AGE_GROUPS).optional(),
  theme: z.string().max(50).optional(),
  feed: z.enum(['community']).optional(),
  story_type: z.enum(['official', 'community']).optional(),
  author: z.string().max(50).optional(),
}).passthrough();

export const languageQuerySchema = z.object({
  language: z.enum(LANGUAGES).default('en'),
}).passthrough();
