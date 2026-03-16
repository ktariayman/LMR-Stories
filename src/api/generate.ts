import { api } from './client';
import { GenerateStoryRequest, Story, Language } from '../types';

export async function generateStory(
  params: GenerateStoryRequest,
): Promise<Story> {
  return api.post<Story>('/api/generate/story', params);
}

export async function translateStory(
  storyId: string,
  targetLanguage: Language,
): Promise<{ success: boolean }> {
  return api.post<{ success: boolean }>('/api/generate/translate', {
    story_id: storyId,
    target_language: targetLanguage,
  });
}
