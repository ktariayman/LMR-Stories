import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import StoryCard from '../components/StoryCard';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';
import { StoryListItem } from '../types';
import { useTranslation } from '../i18n';

export default function HomeScreen() {
  const {
    stories, completedStories,
    isLoading, error, loadStories, loadStory, loadProgress,
  } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    loadStories();
    loadProgress();
  }, []);

  async function handleStoryPress(item: StoryListItem) {
    await loadStory(item.id);
    router.push(`/(tabs)/story/${item.id}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📚 LMR Stories</Text>
          <Text style={styles.headerSub}>{t('home.storiesCount', { count: stories.length })}</Text>
        </View>
      </View>

      {/* Stories list */}
      {isLoading && stories.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t('home.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>📡</Text>
          <Text style={styles.errorTitle}>{t('home.serverError')}</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadStories}>
            <Text style={styles.retryText}>{t('common.tryAgain')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoryCard
              story={item}
              isCompleted={completedStories.includes(item.id)}
              onPress={() => handleStoryPress(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadStories}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.errorEmoji}>📖</Text>
              <Text style={styles.errorTitle}>{t('home.noStories')}</Text>
              <Text style={styles.errorMsg}>{t('home.noStoriesHint')}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 30, fontWeight: '900', color: Colors.primary },
  headerSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 12, fontSize: 16, color: Colors.textSecondary },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  errorMsg: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 },
  retryText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
