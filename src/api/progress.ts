import { api } from './client';
import { UserProgress, ProgressStats, Achievement } from '../types';

export async function fetchProgress(): Promise<UserProgress[]> {
  return api.get<UserProgress[]>('/api/progress');
}

export async function fetchProgressStats(): Promise<ProgressStats> {
  return api.get<ProgressStats>('/api/progress/stats');
}

export async function saveProgress(data: {
  story_id: string;
  language: string;
  quiz_score: number;
  stars: number;
}): Promise<UserProgress> {
  return api.post<UserProgress>('/api/progress', {
    ...data,
    completed: true,
  });
}

export async function fetchAchievements(): Promise<Achievement[]> {
  return api.get<Achievement[]>('/api/achievements');
}
