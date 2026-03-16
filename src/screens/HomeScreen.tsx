import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import StoryCard from '../components/StoryCard';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';
import { RootStackParamList, Language, StoryListItem } from '../types';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN 🇬🇧' },
  { code: 'fr', label: 'FR 🇫🇷' },
  { code: 'ar', label: 'AR 🇸🇦' },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const {
    stories,
    completedStories,
    selectedLanguage,
    isLoading,
    error,
    loadStories,
    loadStory,
    setLanguage,
    loadProgress,
  } = useAppStore();

  useEffect(() => {
    loadStories();
    loadProgress();
  }, []);

  async function handleStoryPress(item: StoryListItem) {
    await loadStory(item.id);
    navigation.navigate('Story', { storyId: item.id });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 LMR Stories</Text>
        <Text style={styles.headerSub}>
          {stories.length} stories to explore
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.filterPill,
              selectedLanguage === lang.code
                ? styles.filterPillActive
                : styles.filterPillInactive,
            ]}
            onPress={() => setLanguage(lang.code)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedLanguage === lang.code
                  ? styles.filterPillTextActive
                  : styles.filterPillTextInactive,
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading && stories.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading stories...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>📡</Text>
          <Text style={styles.errorTitle}>Can't reach the server</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadStories}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoryCard
              story={{
                id: item.id,
                title: item.title,
                difficulty: item.difficulty,
                age_group: item.age_group,
                theme: item.theme,
                themeEmoji: item.theme_emoji,
                summary: item.summary,
                language: item.language,
              }}
              isCompleted={completedStories.includes(item.id)}
              onPress={() => handleStoryPress(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
  },
  headerSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillInactive: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: Colors.white,
  },
  filterPillTextInactive: {
    color: Colors.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  retryText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
