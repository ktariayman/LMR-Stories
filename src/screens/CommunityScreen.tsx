import React, { useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Colors } from '../constants/colors';
import { StoryListItem } from '../types';
import { useTranslation } from '../i18n';

function CommunityCard({ item, onVote, onPress }: {
  item: StoryListItem;
  onVote: (id: string, hasVoted: boolean) => void;
  onPress: (item: StoryListItem) => void;
}) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <Text style={styles.themeEmoji}>{item.theme_emoji}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.diffBadge}>{t(`common.${item.difficulty}` as any)}</Text>
          <Text style={styles.ageBadge}>{t(item.age_group === '5-7' ? 'common.ages57' : 'common.ages810')}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.author}>@{item.author_username || 'unknown'}</Text>
        <TouchableOpacity
          style={styles.voteBtn}
          onPress={() => onVote(item.id, !!item.user_has_voted)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.voteIcon, item.user_has_voted && styles.votedIcon]}>
            {item.user_has_voted ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.voteCount, item.user_has_voted && styles.votedCount]}>
            {item.vote_count || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function CommunityScreen() {
  const { communityStories, loadCommunityStories, voteStory, isLoadingCommunity } = useAppStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    loadCommunityStories();
  }, []);

  const handleVote = useCallback(async (id: string, hasVoted: boolean) => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }
    await voteStory(id, hasVoted);
  }, [user]);

  const handleStoryPress = useCallback((item: StoryListItem) => {
    router.push(`/(tabs)/story/${item.id}`);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('community.title')}</Text>
        <Text style={styles.headerSub}>{t('community.subtitle')}</Text>
      </View>

      {isLoadingCommunity && communityStories.length === 0 ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={communityStories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingCommunity}
              onRefresh={loadCommunityStories}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>✍️</Text>
              <Text style={styles.emptyText}>{t('community.empty')}</Text>
              <Text style={styles.emptySub}>{t('community.emptyHint')}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <CommunityCard item={item} onVote={handleVote} onPress={handleStoryPress} />
          )}
        />
      )}

      {/* FAB — Write a Story */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (!user) { router.push('/(auth)/login'); return; }
          router.push('/(tabs)/community/write');
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>✏️ {t('community.write')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary },
  headerSub: { fontSize: 15, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  themeEmoji: { fontSize: 32 },
  cardMeta: { flexDirection: 'row', gap: 6 },
  diffBadge: {
    backgroundColor: Colors.primaryLight + '30',
    color: Colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '700',
  },
  ageBadge: {
    backgroundColor: Colors.sky + '30',
    color: '#0369A1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '700',
  },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  summary: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  voteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  voteIcon: { fontSize: 20 },
  votedIcon: {},
  voteCount: { fontSize: 15, fontWeight: '800', color: Colors.textSecondary },
  votedCount: { color: Colors.coral },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 12 },
  emptyText: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  emptySub: { fontSize: 15, color: Colors.textSecondary, marginTop: 6 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
});
