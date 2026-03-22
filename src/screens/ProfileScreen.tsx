import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  TouchableOpacity, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AchievementBadge from '../components/AchievementBadge';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Colors } from '../constants/colors';
import { Language, StoryListItem } from '../types';
import { useTranslation } from '../i18n';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function ProfileScreen() {
  const { stats, achievements, isLoading, loadProgress, loadAchievements, myStories, isLoadingMyStories, loadMyStories, selectedLanguage, setLanguage } = useAppStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === selectedLanguage) ?? LANGUAGES[0];

  useEffect(() => {
    loadProgress();
    loadAchievements();
    loadMyStories();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.displayName}>{user?.displayName || user?.username || 'Reader'}</Text>
            {user?.username ? <Text style={styles.username}>@{user.username}</Text> : null}
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>{t('profile.signOut')}</Text>
          </TouchableOpacity>
        </View>

        {/* Language dropdown */}
        <TouchableOpacity style={styles.langSelector} onPress={() => setLangOpen(true)} activeOpacity={0.8}>
          <Text style={styles.langSelectorFlag}>{currentLang.flag}</Text>
          <Text style={styles.langSelectorLabel}>{currentLang.label}</Text>
          <Text style={styles.langSelectorChevron}>▾</Text>
        </TouchableOpacity>

        {/* Language picker modal */}
        <Modal visible={langOpen} transparent animationType="fade" onRequestClose={() => setLangOpen(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangOpen(false)}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>{t('common.language')}</Text>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.modalOption, selectedLanguage === lang.code && styles.modalOptionActive]}
                  onPress={() => { setLanguage(lang.code); setLangOpen(false); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalFlag}>{lang.flag}</Text>
                  <Text style={[styles.modalOptionLabel, selectedLanguage === lang.code && styles.modalOptionLabelActive]}>
                    {lang.label}
                  </Text>
                  {selectedLanguage === lang.code && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Stats */}
        <Text style={styles.sectionTitle}>{t('profile.myProgress')}</Text>
        {isLoading && !stats ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : stats ? (
          <View style={styles.statsGrid}>
            <StatBox emoji="📖" label={t('profile.storiesRead')} value={stats.stories_completed} color={Colors.coral} />
            <StatBox emoji="⭐" label={t('profile.totalStars')} value={stats.total_stars} color={Colors.sunflower} />
            <StatBox emoji="💯" label={t('profile.perfectQuizzes')} value={stats.perfect_quizzes} color={Colors.mint} />
            <StatBox emoji="🌍" label={t('profile.languages')} value={stats.languages_used} color={Colors.sky} />
          </View>
        ) : (
          <TouchableOpacity style={styles.retryBtn} onPress={() => { loadProgress(); loadAchievements(); }}>
            <Text style={styles.retryText}>{t('profile.retry')}</Text>
          </TouchableOpacity>
        )}

        {/* My Stories Library */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('profile.myStories')}</Text>
          <Text style={styles.storyCount}>{t('profile.stories', { count: myStories.length })}</Text>
        </View>

        {isLoadingMyStories ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 16 }} />
        ) : myStories.length === 0 ? (
          <View style={styles.emptyLibrary}>
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyText}>{t('profile.noStories')}</Text>
          </View>
        ) : (
          myStories.map((story) => (
            <MyStoryCard
              key={story.id}
              story={story}
              onPress={() => router.push(`/(tabs)/story/${story.id}`)}
            />
          ))
        )}

        {/* Achievements */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>{t('profile.achievements')}</Text>
        {achievements.length === 0 ? (
          <View style={styles.emptyLibrary}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyText}>{t('profile.startAchievements')}</Text>
          </View>
        ) : (
          achievements.map((ach) => (
            <AchievementBadge key={ach.id} achievement={ach} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MyStoryCard({ story, onPress }: { story: StoryListItem; onPress: () => void }) {
  const { t } = useTranslation();
  const isPublic = story.is_public;
  return (
    <TouchableOpacity style={styles.storyCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.storyEmoji}>
        <Text style={{ fontSize: 26 }}>{story.theme_emoji || '📖'}</Text>
      </View>
      <View style={styles.storyInfo}>
        <Text style={styles.storyTitle} numberOfLines={1}>{story.title}</Text>
        <Text style={styles.storySummary} numberOfLines={2}>{story.summary}</Text>
        <View style={styles.storyMeta}>
          <View style={[styles.badge, { backgroundColor: isPublic ? Colors.mint + '30' : Colors.lavender + '30' }]}>
            <Text style={[styles.badgeText, { color: isPublic ? Colors.mint : Colors.lavender }]}>
              {isPublic ? t('profile.public') : t('profile.private')}
            </Text>
          </View>
          {story.is_ai_generated && (
            <View style={[styles.badge, { backgroundColor: Colors.sunflower + '30' }]}>
              <Text style={[styles.badgeText, { color: Colors.sunflower }]}>{t('profile.ai')}</Text>
            </View>
          )}
          {(story.vote_count ?? 0) > 0 && (
            <View style={[styles.badge, { backgroundColor: Colors.coral + '20' }]}>
              <Text style={[styles.badgeText, { color: Colors.coral }]}>❤️ {story.vote_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function StatBox({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  return (
    <View style={[styles.statBox, { borderColor: color + '40' }]}>
      <View style={[styles.statIconBg, { backgroundColor: color + '20' }]}>
        <Text style={styles.statEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  userCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 20, padding: 16,
    marginBottom: 24, borderWidth: 2, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarEmoji: { fontSize: 28 },
  userInfo: { flex: 1 },
  displayName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  username: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12, borderWidth: 2, borderColor: Colors.border,
  },
  logoutText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  storyCount: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statBox: {
    width: '47%', backgroundColor: Colors.white, borderRadius: 18,
    padding: 16, alignItems: 'center', borderWidth: 2,
  },
  statIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statEmoji: { fontSize: 24 },
  statValue: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  emptyLibrary: { alignItems: 'center', paddingVertical: 24, marginBottom: 16 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  retryBtn: { backgroundColor: Colors.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 14, marginTop: 8, marginBottom: 20, alignSelf: 'center' },
  retryText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  storyCard: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 16,
    padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  storyEmoji: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  storyInfo: { flex: 1 },
  storyTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 3 },
  storySummary: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginBottom: 8 },
  storyMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  // Language dropdown
  langSelector: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: 14, paddingVertical: 12,
    paddingHorizontal: 16, marginBottom: 20, borderWidth: 1.5, borderColor: Colors.border,
  },
  langSelectorFlag: { fontSize: 20 },
  langSelectorLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  langSelectorChevron: { fontSize: 16, color: Colors.textSecondary },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  modalSheet: {
    width: '100%', backgroundColor: Colors.white,
    borderRadius: 24, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16, textAlign: 'center' },
  modalOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, marginBottom: 8,
    backgroundColor: Colors.background,
  },
  modalOptionActive: { backgroundColor: Colors.primary + '15', borderWidth: 2, borderColor: Colors.primary },
  modalFlag: { fontSize: 24 },
  modalOptionLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  modalOptionLabelActive: { color: Colors.primary, fontWeight: '800' },
  checkmark: { fontSize: 18, color: Colors.primary, fontWeight: '900' },
});
