// === Core Data Types ===

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  answer?: string;
  correct_answer?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type AgeGroup = '5-7' | '8-10';
export type Language = 'en' | 'fr' | 'ar';
export type Theme = 'friendship' | 'animals' | 'adventure' | 'kindness' | 'courage';
export type StoryType = 'official' | 'community';

export interface Story {
  id: string;
  slug: string;
  title: string;
  language: Language;
  difficulty: Difficulty;
  age_group: AgeGroup;
  theme: Theme;
  themeEmoji: string;
  content: string;
  summary: string;
  quiz: QuizQuestion[];
  is_ai_generated?: boolean;
  cover_image?: string | null;
  audio_content?: string | null;
  story_type?: StoryType;
  author_id?: string | null;
  author_username?: string | null;
  is_public?: boolean;
  vote_count?: number;
}

// API response shape from server
export interface StoryListItem {
  id: string;
  slug: string;
  difficulty: Difficulty;
  age_group: AgeGroup;
  theme: Theme;
  theme_emoji: string;
  is_ai_generated: boolean;
  story_type: StoryType;
  author_id?: string | null;
  author_username?: string | null;
  is_public?: boolean;
  vote_count?: number;
  user_has_voted?: boolean;
  cover_image?: string | null;
  title: string;
  summary: string;
  language: Language;
  audio_content?: string | null;
}

export interface StoryDetail {
  id: string;
  slug: string;
  difficulty: Difficulty;
  age_group: AgeGroup;
  theme: Theme;
  theme_emoji: string;
  is_ai_generated: boolean;
  story_type: StoryType;
  author_id?: string | null;
  author_username?: string | null;
  is_public?: boolean;
  vote_count?: number;
  cover_image?: string | null;
  title: string;
  content: string;
  summary: string;
  language: Language;
  available_languages: Language[];
  quiz: QuizQuestion[];
  audio_content?: string | null;
}

// === User & Auth ===

export interface User {
  id: string;
  username: string;
  displayName: string | null;
}

// === Progress & Achievements ===

export interface UserProgress {
  story_id: string;
  language: Language;
  completed: boolean;
  quiz_score: number;
  stars: number;
  completed_at: string;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  emoji: string;
  requirement_type: 'stories_completed' | 'perfect_quizzes' | 'languages_used' | 'streak';
  requirement_value: number;
  unlocked: boolean;
  earned_at?: string | null;
}

export interface ProgressStats {
  stories_completed: number;
  perfect_quizzes: number;
  languages_used: number;
  total_stars: number;
  achievements_earned: number;
}

// === AI Generation ===

export interface GenerateStoryRequest {
  theme: string;
  difficulty: Difficulty;
  age_group: AgeGroup;
  language: Language;
  is_public?: boolean;
}

export interface GenerateStoryResponse {
  story: Story;
}

// === Navigation ===

export type RootStackParamList = {
  Home: undefined;
  Story: { storyId: string };
  Quiz: { storyId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  Community: undefined;
  Generate: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type QuizAnswers = Record<number, string>;
