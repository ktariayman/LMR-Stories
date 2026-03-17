import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Story,
  StoryListItem,
  QuizAnswers,
  Language,
  Difficulty,
  AgeGroup,
  Theme,
  UserProgress,
  Achievement,
  ProgressStats,
} from '../types';
import { fetchStories, fetchStory } from '../api/stories';
import { fetchProgress, fetchProgressStats, saveProgress, fetchAchievements } from '../api/progress';

interface AppState {
  // Stories
  stories: StoryListItem[];
  currentStory: Story | null;
  selectedLanguage: Language;
  filterDifficulty: Difficulty | null;
  filterAgeGroup: AgeGroup | null;
  filterTheme: Theme | null;
  isLoading: boolean;
  error: string | null;

  // Quiz
  quizAnswers: QuizAnswers;
  quizScore: number;

  // Progress
  completedStories: string[];
  progress: UserProgress[];
  stats: ProgressStats | null;
  achievements: Achievement[];

  // Audio
  isPlaying: boolean;

  // Actions - Stories
  loadStories: () => Promise<void>;
  loadStory: (id: string) => Promise<void>;
  setLanguage: (lang: Language) => void;
  setFilterDifficulty: (d: Difficulty | null) => void;
  setFilterAgeGroup: (a: AgeGroup | null) => void;
  setFilterTheme: (t: Theme | null) => void;

  // Actions - Quiz
  setQuizAnswer: (index: number, answer: string) => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;

  // Actions - Progress
  loadProgress: () => Promise<void>;
  loadAchievements: () => Promise<void>;

  // Actions - Audio
  setIsPlaying: (playing: boolean) => void;
}

const STORAGE_KEY = 'lmr_stories_state';

async function persistState(state: Partial<AppState>) {
  try {
    const saved = {
      selectedLanguage: state.selectedLanguage,
      completedStories: state.completedStories,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {}
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  stories: [],
  currentStory: null,
  selectedLanguage: 'en',
  filterDifficulty: null,
  filterAgeGroup: null,
  filterTheme: null,
  isLoading: false,
  error: null,

  quizAnswers: {},
  quizScore: 0,

  completedStories: [],
  progress: [],
  stats: null,
  achievements: [],

  isPlaying: false,

  // --- Story actions ---

  loadStories: async () => {
    const { selectedLanguage, filterDifficulty, filterAgeGroup, filterTheme } = get();
    set({ isLoading: true, error: null });
    try {
      const data = await fetchStories({
        language: selectedLanguage,
        difficulty: filterDifficulty ?? undefined,
        age_group: filterAgeGroup ?? undefined,
        theme: filterTheme ?? undefined,
      });
      set({ stories: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  loadStory: async (id: string) => {
    const { selectedLanguage } = get();
    set({ isLoading: true, error: null });
    try {
      const detail = await fetchStory(id, selectedLanguage);
      const story: Story = {
        id: detail.id,
        slug: detail.slug,
        title: detail.title,
        language: detail.language,
        difficulty: detail.difficulty,
        age_group: detail.age_group,
        theme: detail.theme,
        themeEmoji: detail.theme_emoji,
        content: detail.content,
        summary: detail.summary,
        quiz: detail.quiz,
        is_ai_generated: detail.is_ai_generated,
        audio_content: detail.audio_content,
      };
      set({ currentStory: story, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  setLanguage: (lang) => {
    set({ selectedLanguage: lang });
    persistState({ ...get(), selectedLanguage: lang });
    get().loadStories();
  },

  setFilterDifficulty: (d) => {
    set({ filterDifficulty: d });
    get().loadStories();
  },

  setFilterAgeGroup: (a) => {
    set({ filterAgeGroup: a });
    get().loadStories();
  },

  setFilterTheme: (t) => {
    set({ filterTheme: t });
    get().loadStories();
  },

  // --- Quiz actions ---

  setQuizAnswer: (index, answer) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [index]: answer },
    })),

  submitQuiz: async () => {
    const { currentStory, quizAnswers, selectedLanguage } = get();
    if (!currentStory) return;

    const score = currentStory.quiz.reduce((acc, q, i) => {
      const correct = q.correct_answer || q.answer;
      return quizAnswers[i] === correct ? acc + 1 : acc;
    }, 0);

    const total = currentStory.quiz.length;
    const stars = score === total ? 3 : score >= total * 0.66 ? 2 : 1;

    set({ quizScore: score });

    // Save to API
    try {
      await saveProgress({
        story_id: currentStory.id,
        language: selectedLanguage,
        quiz_score: score,
        stars,
      });

      set((state) => ({
        completedStories: state.completedStories.includes(currentStory.id)
          ? state.completedStories
          : [...state.completedStories, currentStory.id],
      }));
      persistState(get());
    } catch {
      // Still mark locally even if API fails
      set((state) => ({
        completedStories: state.completedStories.includes(currentStory.id)
          ? state.completedStories
          : [...state.completedStories, currentStory.id],
      }));
      persistState(get());
    }
  },

  resetQuiz: () => set({ quizAnswers: {}, quizScore: 0 }),

  // --- Progress actions ---

  loadProgress: async () => {
    try {
      const [progress, stats] = await Promise.all([
        fetchProgress(),
        fetchProgressStats(),
      ]);
      const completed = progress
        .filter((p) => p.completed)
        .map((p) => p.story_id);
      set({ progress, stats, completedStories: completed });
    } catch {}
  },

  loadAchievements: async () => {
    try {
      const achievements = await fetchAchievements();
      set({ achievements });
    } catch {}
  },

  // --- Audio ---

  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));

// Hydrate persisted state on load
(async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      useAppStore.setState({
        selectedLanguage: saved.selectedLanguage || 'en',
        completedStories: saved.completedStories || [],
      });
    }
  } catch {}
})();
