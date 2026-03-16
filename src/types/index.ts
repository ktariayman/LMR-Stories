// === Core Data Types ===

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  answer: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type AgeGroup = '5-7' | '8-10';
export type Language = 'en' | 'fr' | 'ar';
export type Theme = 'friendship' | 'animals' | 'adventure' | 'kindness' | 'courage';

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
  title: string;
  summary: string;
  language: Language;
}

export interface StoryDetail {
  id: string;
  slug: string;
  difficulty: Difficulty;
  age_group: AgeGroup;
  theme: Theme;
  theme_emoji: string;
  is_ai_generated: boolean;
  translation: {
    language: Language;
    title: string;
    content: string;
    summary: string;
  };
  quiz: QuizQuestion[];
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
  earned: boolean;
  earned_at?: string;
}

export interface ProgressStats {
  stories_completed: number;
  perfect_quizzes: number;
  languages_used: number;
  total_stars: number;
  current_streak: number;
}

// === AI Generation ===

export interface GenerateStoryRequest {
  theme: Theme;
  difficulty: Difficulty;
  age_group: AgeGroup;
  language: Language;
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
  GenerateTab: undefined;
  ProfileTab: undefined;
};

export type QuizAnswers = Record<number, string>;
