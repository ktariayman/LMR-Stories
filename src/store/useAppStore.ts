import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Story, StoryListItem, QuizAnswers, Language,
  Difficulty, AgeGroup, Theme, UserProgress, Achievement, ProgressStats,
} from '../types';
import { fetchStories, fetchStory } from '../api/stories';
import { fetchProgress, fetchProgressStats, saveProgress, fetchAchievements } from '../api/progress';
import { api } from '../api/client';

interface AppState {
  // Official stories
  stories: StoryListItem[];
  currentStory: Story | null;
  selectedLanguage: Language;
  filterDifficulty: Difficulty | null;
  filterAgeGroup: AgeGroup | null;
  filterTheme: Theme | null;
  isLoading: boolean;
  error: string | null;

  // Community stories
  communityStories: StoryListItem[];
  isLoadingCommunity: boolean;

  // My stories (user library)
  myStories: StoryListItem[];
  isLoadingMyStories: boolean;

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

  // Actions - Official Stories
  loadStories: () => Promise<void>;
  loadStory: (id: string) => Promise<void>;
  setLanguage: (lang: Language) => void;
  setFilterDifficulty: (d: Difficulty | null) => void;
  setFilterAgeGroup: (a: AgeGroup | null) => void;
  setFilterTheme: (t: Theme | null) => void;

  // Actions - Community
  loadCommunityStories: () => Promise<void>;
  loadMyStories: () => Promise<void>;
  voteStory: (id: string, hasVoted: boolean) => Promise<void>;
  submitCommunityStory: (data: {
    title: string; content: string; summary: string;
    theme: string; themeEmoji: string; difficulty: Difficulty;
    language: Language; isPublic: boolean;
  }) => Promise<void>;

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
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      selectedLanguage: state.selectedLanguage,
      completedStories: state.completedStories,
    }));
  } catch {}
}

export const useAppStore = create<AppState>((set, get) => ({
  stories: [],
  currentStory: null,
  selectedLanguage: 'en',
  filterDifficulty: null,
  filterAgeGroup: null,
  filterTheme: null,
  isLoading: false,
  error: null,

  communityStories: [],
  isLoadingCommunity: false,
  myStories: [],
  isLoadingMyStories: false,

  quizAnswers: {},
  quizScore: 0,

  completedStories: [],
  progress: [],
  stats: null,
  achievements: [],

  isPlaying: false,

  // ─── Official Stories ───────────────────────────────────────────────────────

  loadStories: async () => {
    const { selectedLanguage, filterDifficulty, filterAgeGroup, filterTheme } = get();
    set({ isLoading: true, error: null });
    try {
      const data = await fetchStories({
        language: selectedLanguage,
        difficulty: filterDifficulty ?? undefined,
        age_group: filterAgeGroup ?? undefined,
        theme: filterTheme ?? undefined,
        story_type: 'official',
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
        story_type: detail.story_type,
        author_id: detail.author_id,
        author_username: detail.author_username,
        is_public: detail.is_public,
        vote_count: detail.vote_count,
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

  setFilterDifficulty: (d) => { set({ filterDifficulty: d }); get().loadStories(); },
  setFilterAgeGroup: (a) => { set({ filterAgeGroup: a }); get().loadStories(); },
  setFilterTheme: (t) => { set({ filterTheme: t }); get().loadStories(); },

  // ─── Community ──────────────────────────────────────────────────────────────

  loadCommunityStories: async () => {
    set({ isLoadingCommunity: true });
    try {
      const data = await api.get<StoryListItem[]>(
        `/api/stories?feed=community&language=${get().selectedLanguage}`
      );
      set({ communityStories: data, isLoadingCommunity: false });
    } catch {
      set({ isLoadingCommunity: false });
    }
  },

  loadMyStories: async () => {
    set({ isLoadingMyStories: true });
    try {
      const data = await api.get<StoryListItem[]>(
        `/api/stories?author=me&language=${get().selectedLanguage}`
      );
      set({ myStories: data, isLoadingMyStories: false });
    } catch {
      set({ isLoadingMyStories: false });
    }
  },

  voteStory: async (id: string, hasVoted: boolean) => {
    try {
      if (hasVoted) {
        await api.del(`/api/stories/${id}/vote`);
      } else {
        await api.post(`/api/stories/${id}/vote`, {});
      }
      // Optimistic update
      set((state) => ({
        communityStories: state.communityStories.map((s) =>
          s.id === id
            ? {
                ...s,
                user_has_voted: !hasVoted,
                vote_count: (s.vote_count || 0) + (hasVoted ? -1 : 1),
              }
            : s
        ),
      }));
    } catch (e: any) {
      console.warn('Vote failed:', e.message);
    }
  },

  submitCommunityStory: async (data) => {
    const slug = `community-${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}-${Date.now()}`;
    await api.post('/api/stories', {
      slug,
      difficulty: data.difficulty,
      age_group: '5-7',
      theme: data.theme,
      theme_emoji: data.themeEmoji,
      is_public: data.isPublic,
      translations: [{
        language: data.language,
        title: data.title,
        content: data.content,
        summary: data.summary,
      }],
    });
    // Refresh community feed
    await get().loadCommunityStories();
  },

  // ─── Quiz ───────────────────────────────────────────────────────────────────

  setQuizAnswer: (index, answer) =>
    set((state) => ({ quizAnswers: { ...state.quizAnswers, [index]: answer } })),

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

    // Mark completed locally immediately
    set((state) => ({
      completedStories: state.completedStories.includes(currentStory.id)
        ? state.completedStories
        : [...state.completedStories, currentStory.id],
    }));
    persistState(get());

    try {
      await saveProgress({ story_id: currentStory.id, language: selectedLanguage, quiz_score: score, stars });
      // Refresh stats so Profile screen reflects new stars/score
      get().loadProgress();
    } catch {
      // Progress saved locally; server sync failed silently
    }
  },

  resetQuiz: () => set({ quizAnswers: {}, quizScore: 0 }),

  // ─── Progress ───────────────────────────────────────────────────────────────

  loadProgress: async () => {
    try {
      const [progress, stats] = await Promise.all([fetchProgress(), fetchProgressStats()]);
      const completed = progress.filter((p) => p.completed).map((p) => p.story_id);
      set({ progress, stats, completedStories: completed });
    } catch {}
  },

  loadAchievements: async () => {
    try {
      set({ achievements: await fetchAchievements() });
    } catch {}
  },

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
