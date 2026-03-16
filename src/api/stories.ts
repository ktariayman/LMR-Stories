import { api } from './client';
import {
  StoryListItem,
  StoryDetail,
  Language,
  Difficulty,
  AgeGroup,
  Theme,
} from '../types';

interface StoryFilters {
  language?: Language;
  difficulty?: Difficulty;
  age_group?: AgeGroup;
  theme?: Theme;
}

export async function fetchStories(filters: StoryFilters = {}): Promise<StoryListItem[]> {
  const params = new URLSearchParams();
  if (filters.language) params.set('language', filters.language);
  if (filters.difficulty) params.set('difficulty', filters.difficulty);
  if (filters.age_group) params.set('age_group', filters.age_group);
  if (filters.theme) params.set('theme', filters.theme);

  const query = params.toString();
  return api.get<StoryListItem[]>(`/api/stories${query ? `?${query}` : ''}`);
}

export async function fetchStory(
  id: string,
  language: Language = 'en',
): Promise<StoryDetail> {
  return api.get<StoryDetail>(`/api/stories/${id}?language=${language}`);
}

export async function fetchQuiz(
  storyId: string,
  language: Language = 'en',
) {
  return api.get<StoryDetail['quiz']>(`/api/stories/${storyId}/quiz?language=${language}`);
}

export async function submitQuiz(
  storyId: string,
  answers: Record<number, string>,
  language: Language = 'en',
) {
  return api.post<{ score: number; total: number; stars: number }>(
    `/api/stories/${storyId}/quiz/submit`,
    { answers, language },
  );
}
