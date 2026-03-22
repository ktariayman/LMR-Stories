import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import StoryScreen from '../../../src/screens/StoryScreen';
import { useAppStore } from '../../../src/store/useAppStore';

export default function Story() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loadStory, currentStory } = useAppStore();

  useEffect(() => {
    if (id && currentStory?.id !== id) {
      loadStory(id);
    }
  }, [id]);

  return <StoryScreen />;
}
