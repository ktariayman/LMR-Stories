import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateStory } from '../api/generate';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';
import { Difficulty, AgeGroup, Language } from '../types';
import { appConfig } from '../config/appConfig';
import { useTranslation } from '../i18n';

export default function GenerateScreen() {
  const { loadStories, loadCommunityStories } = useAppStore();
  const { t } = useTranslation();

  const THEMES = [
    { value: 'friendship', label: t('common.friendship'), emoji: '🤝' },
    { value: 'adventure', label: t('common.adventure'), emoji: '🗺️' },
    { value: 'kindness', label: t('common.kindness'), emoji: '💛' },
    { value: 'courage', label: t('common.courage'), emoji: '🦁' },
    { value: 'animals', label: t('common.animals'), emoji: '🐾' },
    { value: 'nature', label: t('common.nature'), emoji: '🌿' },
    { value: 'family', label: t('common.family'), emoji: '🏠' },
  ];
  const DIFFICULTIES: { value: Difficulty; label: string; emoji: string }[] = [
    { value: 'easy', label: t('common.easy'), emoji: '🌱' },
    { value: 'medium', label: t('common.medium'), emoji: '🌻' },
    { value: 'hard', label: t('common.hard'), emoji: '🌲' },
  ];
  const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
    { value: '5-7', label: t('common.ages57') },
    { value: '8-10', label: t('common.ages810') },
  ];
  const LANGUAGES: { value: Language; label: string; flag: string }[] = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const [theme, setTheme] = useState('adventure');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('5-7');
  const [language, setLanguage] = useState<Language>('en');
  const [isPublic, setIsPublic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!appConfig.enableAI) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.disabledEmoji}>🤖</Text>
          <Text style={styles.disabledTitle}>{t('generate.disabled')}</Text>
          <Text style={styles.disabledSub}>{t('generate.disabledHint')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);
    try {
      await generateStory({ theme, difficulty, age_group: ageGroup, language, is_public: isPublic });
      setSuccess(true);
      loadStories();
      if (isPublic) loadCommunityStories();
    } catch (e: any) {
      setError(e.message || 'Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  }

  function PillGroup<T extends string>({
    items, selected, onSelect,
  }: { items: { value: T; label: string; emoji?: string }[]; selected: T; onSelect: (v: T) => void }) {
    return (
      <View style={styles.pillRow}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.pill, selected === item.value && styles.pillActive]}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.8}
          >
            {item.emoji ? <Text style={styles.pillEmoji}>{item.emoji}</Text> : null}
            <Text style={[styles.pillText, selected === item.value && styles.pillTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('generate.title')}</Text>
        <Text style={styles.subtitle}>{t('generate.subtitle')}</Text>

        <Text style={styles.sectionLabel}>{t('common.theme')}</Text>
        <PillGroup items={THEMES} selected={theme} onSelect={setTheme} />

        <Text style={styles.sectionLabel}>{t('common.difficulty')}</Text>
        <PillGroup items={DIFFICULTIES} selected={difficulty} onSelect={setDifficulty} />

        <Text style={styles.sectionLabel}>{t('common.ageGroup')}</Text>
        <PillGroup items={AGE_GROUPS} selected={ageGroup} onSelect={setAgeGroup} />

        <Text style={styles.sectionLabel}>{t('common.language')}</Text>
        <PillGroup items={LANGUAGES.map((l) => ({ value: l.value, label: l.label, emoji: l.flag }))} selected={language} onSelect={setLanguage} />

        {/* Public toggle */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>{t('common.shareWithCommunity')}</Text>
            <Text style={styles.toggleSub}>{isPublic ? t('common.visibleToEveryone') : t('common.onlyYouCanSee')}</Text>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#D1D5DB', true: Colors.primaryLight }}
            thumbColor={isPublic ? Colors.primary : '#9CA3AF'}
          />
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              {isPublic ? t('generate.published') : t('generate.saved')}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating}
          activeOpacity={0.85}
        >
          {isGenerating ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={Colors.white} size="small" />
              <Text style={styles.generateBtnText}>{t('generate.creating')}</Text>
            </View>
          ) : (
            <Text style={styles.generateBtnText}>{t('generate.button')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  disabledEmoji: { fontSize: 64, marginBottom: 16 },
  disabledTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  disabledSub: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
  title: { fontSize: 30, fontWeight: '900', color: Colors.primary },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 4, marginBottom: 24 },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 10, marginTop: 18 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 22, borderWidth: 2, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillEmoji: { fontSize: 16 },
  pillText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  pillTextActive: { color: Colors.white },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    borderWidth: 2, borderColor: Colors.border, marginTop: 20,
  },
  toggleLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  toggleSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  errorBox: { backgroundColor: '#FFF0F0', borderRadius: 12, padding: 14, marginTop: 20, borderLeftWidth: 4, borderLeftColor: Colors.optionWrong },
  errorText: { color: Colors.optionWrong, fontSize: 14, fontWeight: '600' },
  successBox: { backgroundColor: '#F0FFF4', borderRadius: 12, padding: 14, marginTop: 20, borderLeftWidth: 4, borderLeftColor: Colors.optionCorrect },
  successText: { color: '#166534', fontSize: 14, fontWeight: '600' },
  generateBtn: {
    backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 18,
    alignItems: 'center', marginTop: 28,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  generateBtnDisabled: { opacity: 0.7 },
  generateBtnText: { color: Colors.white, fontSize: 18, fontWeight: '900' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
