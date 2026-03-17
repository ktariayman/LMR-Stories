import { useLocalSearchParams } from 'expo-router';
import QuizScreen from '../../../src/screens/QuizScreen';

export default function Quiz() {
  const { id } = useLocalSearchParams();
  return <QuizScreen />;
}
