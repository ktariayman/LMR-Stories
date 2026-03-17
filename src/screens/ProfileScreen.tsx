import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AchievementBadge from '../components/AchievementBadge';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';

export default function ProfileScreen() {
  const {
    stats,
    achievements,
    isLoading,
    loadProgress,
    loadAchievements,
  } = useAppStore();

  useEffect(() => {
    loadProgress();
    loadAchievements();
  }, []);

  const handleRefresh = () => {
    loadProgress();
    loadAchievements();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Progress</Text>

        {isLoading && !stats ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : stats ? (
          <>
            <View style={styles.statsGrid}>
              <StatBox emoji="📖" label="Stories Read" value={stats.stories_completed} />
              <StatBox emoji="⭐" label="Total Stars" value={stats.total_stars} />
              <StatBox emoji="💯" label="Perfect Quizzes" value={stats.perfect_quizzes} />
              <StatBox emoji="🌍" label="Languages" value={stats.languages_used} />
            </View>

            <Text style={styles.sectionTitle}>Achievements</Text>
            {achievements.length === 0 ? (
              <Text style={styles.emptyText}>
                Start reading stories to earn achievements!
              </Text>
            ) : (
              achievements.map((ach) => (
                <AchievementBadge key={ach.id} achievement={ach} />
              ))
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📡</Text>
            <Text style={styles.emptyTitle}>Can't load progress</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRefresh}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ emoji, label, value }: { emoji: string; label: string; value: number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
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
