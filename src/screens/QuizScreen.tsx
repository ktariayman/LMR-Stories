import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import StarRating from '../components/StarRating';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';
import { getTextStyle } from '../utils/rtl';
import { useTranslation } from '../i18n';

type OptionState = 'default' | 'selected' | 'correct' | 'wrong';

export default function QuizScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const {
    currentStory,
    quizScore,
    setQuizAnswer,
    submitQuiz,
    resetQuiz,
  } = useAppStore();
  const { t } = useTranslation();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  function getMessage(score: number, total: number): string {
    if (score === total) return t('quiz.perfect');
    if (score === total - 1) return t('quiz.great');
    if (score === 1) return t('quiz.good');
    return t('quiz.keepTrying');
  }

  if (!currentStory) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{t('quiz.noStory')}</Text>
      </SafeAreaView>
    );
  }

  const quiz = currentStory.quiz ?? [];
  const rtlStyle = getTextStyle(currentStory.language);

  // No questions available for this story
  if (quiz.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{currentStory.title}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📖</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#374151', textAlign: 'center' }}>
            {t('quiz.noQuestions')}
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 32, width: 'auto', paddingHorizontal: 32 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz[questionIndex];

  function deriveOptionState(option: string): OptionState {
    if (!isAnswered) {
      return option === selectedAnswer ? 'selected' : 'default';
    }
    const correctAnswer = (currentQuestion as any).correct_answer || currentQuestion.answer;
    if (option === correctAnswer) return 'correct';
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
    router.push('/(tabs)/');
  }

  if (showResults) {
    return (
      <View style={[styles.container, styles.resultsContainer]}>
        <SafeAreaView edges={['top']} style={styles.resultsSafe}>
          <ScrollView
            contentContainerStyle={[
              styles.resultsContent,
              { paddingBottom: tabBarHeight + 10 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.resultsTitle}>{t('quiz.complete')}</Text>
            <StarRating score={quizScore} total={quiz.length} />
            <Text style={styles.scoreText}>
              {t('quiz.score', { score: quizScore, total: quiz.length })}
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
                {t('quiz.tryAgain')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              onPress={handleBackToStories}
              activeOpacity={0.85}
            >
              <Text style={styles.outlineButtonText} allowFontScaling={false}>
                {t('quiz.backToStories')}
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
            onPress={() => router.back()}
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
          { paddingBottom: tabBarHeight + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProgressBar current={questionIndex + 1} total={quiz.length} />

        <Text style={[styles.questionText, rtlStyle]}>
          {currentQuestion.question}
        </Text>

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
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 32,
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
    fontSize: 32,
    fontWeight: '900',
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
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '900',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderRadius: 18,
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
