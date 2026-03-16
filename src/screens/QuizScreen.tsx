import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import StarRating from '../components/StarRating';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';

type QuizNavProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

type OptionState = 'default' | 'selected' | 'correct' | 'wrong';

function getMessage(score: number, total: number): string {
  if (score === total) return 'Amazing! You got them all! 🌟';
  if (score === total - 1) return 'Great job! 🙂';
  if (score === 1) return 'Good try! Keep reading! 💪';
  return "Let's read the story again! 📖";
}

export default function QuizScreen() {
  const navigation = useNavigation<QuizNavProp>();
  const insets = useSafeAreaInsets();
  const {
    currentStory,
    quizScore,
    setQuizAnswer,
    submitQuiz,
    resetQuiz,
    markStoryCompleted,
  } = useAppStore();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  if (!currentStory) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No story selected.</Text>
      </SafeAreaView>
    );
  }

  const quiz = currentStory.quiz;
  const currentQuestion = quiz[questionIndex];

  function deriveOptionState(option: string): OptionState {
    if (!isAnswered) {
      return option === selectedAnswer ? 'selected' : 'default';
    }
    if (option === currentQuestion.answer) return 'correct';
    if (option === selectedAnswer) return 'wrong';
    return 'default';
  }

  function handleAnswer(option: string) {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);
    setQuizAnswer(questionIndex, option);

    setTimeout(() => {
      const isLast = questionIndex === quiz.length - 1;
      if (isLast) {
        submitQuiz();
        setShowResults(true);
      } else {
        setQuestionIndex((i) => i + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }, 1200);
  }

  function handleTryAgain() {
    resetQuiz();
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResults(false);
  }

  function handleBackToStories() {
    if (currentStory) markStoryCompleted(currentStory.id);
    navigation.navigate('Home');
  }

  if (showResults) {
    return (
      <View style={[styles.container, styles.resultsContainer]}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.resultsSafe}>
          <ScrollView
            contentContainerStyle={[
              styles.resultsContent,
              { paddingBottom: insets.bottom + 24 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.resultsTitle}>Quiz Complete! 🎉</Text>
            <StarRating score={quizScore} total={quiz.length} />
            <Text style={styles.scoreText}>
              {quizScore} out of {quiz.length}
            </Text>
            <Text style={styles.messageText}>
              {getMessage(quizScore, quiz.length)}
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleTryAgain}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText} allowFontScaling={false}>
                Try Again 🔄
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              onPress={handleBackToStories}
              activeOpacity={0.85}
            >
              <Text style={styles.outlineButtonText} allowFontScaling={false}>
                Back to Stories 📚
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentStory.title}
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={[
          styles.quizContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProgressBar current={questionIndex + 1} total={quiz.length} />

        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <QuizOption
              key={option}
              text={option}
              state={deriveOptionState(option)}
              onPress={() => handleAnswer(option)}
              disabled={isAnswered}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  headerSafe: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backArrow: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quizContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 34,
    marginBottom: 28,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 4,
  },
  // Results
  resultsContainer: {
    backgroundColor: Colors.quizBackground,
  },
  resultsSafe: {
    flex: 1,
  },
  resultsContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  resultsTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  outlineButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
