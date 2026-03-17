import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import AudioPlayer from '../components/AudioPlayer';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function StoryScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { currentStory, resetQuiz } = useAppStore();

  const story = currentStory;

  if (!story) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Story not found.</Text>
      </SafeAreaView>
    );
  }

  const difficultyColor =
    story.difficulty === 'easy' ? Colors.easyBadge : Colors.mediumBadge;

  function handleStartQuiz() {
    resetQuiz();
    router.push(`/(tabs)/quiz/${story!.id}`);
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
            {story.title}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.badgeText} allowFontScaling={false}>
              {story.difficulty.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: Colors.ageBadge }]}>
            <Text style={styles.badgeText} allowFontScaling={false}>
              Age {story.age_group}
            </Text>
          </View>
          <Text style={styles.themeEmoji}>{story.themeEmoji}</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AudioPlayer text={story.content} audioBase64={story.audio_content} />

        <Text style={styles.storyText}>{story.content}</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>💡 The lesson</Text>
          <Text style={styles.summaryText}>{story.summary}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.quizButton}
            onPress={handleStartQuiz}
            activeOpacity={0.85}
          >
            <Text style={styles.quizButtonText} allowFontScaling={false}>
              Start Quiz 🎯
            </Text>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  themeEmoji: {
    fontSize: 22,
    marginLeft: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  storyText: {
    fontSize: 20,
    lineHeight: 34,
    color: Colors.textPrimary,
    fontWeight: '400',
  },
  summaryBox: {
    marginTop: 28,
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  summaryText: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: 32,
    marginBottom: 20,
  },
  quizButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  quizButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
