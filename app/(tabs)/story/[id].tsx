import { useLocalSearchParams } from 'expo-router';
import StoryScreen from '../../../src/screens/StoryScreen';

export default function Story() {
  const { id } = useLocalSearchParams();
  // The StoryScreen currently gets storyId from currentStory in store, 
  // but it's good to have it in the URL too.
  return <StoryScreen />;
}
