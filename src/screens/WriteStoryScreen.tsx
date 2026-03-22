import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Switch, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';
import { Language, Difficulty } from '../types';
import { useTranslation } from '../i18n';

const THEMES = ['adventure', 'kindness', 'friendship', 'courage', 'animals', 'nature', 'family'];
const THEME_EMOJIS: Record<string, string> = {
  adventure: '🗺️', kindness: '💛', friendship: '🤝', courage: '🦁',
  animals: '🐾', nature: '🌿', family: '🏠',
};
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

export default function WriteStoryScreen() {
  const { submitCommunityStory } = useAppStore();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [theme, setTheme] = useState('adventure');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [language, setLanguage] = useState<Language>('en');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = title.trim().length > 3 && content.trim().length > 50;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await submitCommunityStory({
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim(),
        theme,
        themeEmoji: THEME_EMOJIS[theme] || '📖',
        difficulty,
        language,
        isPublic,
      });
      Alert.alert(
        t('write.publishedTitle'),
        isPublic ? t('write.publishedMsg') : t('write.savedMsg'),
        [{ text: t('common.ok'), onPress: () => router.back() }],
      );
    } catch (e: any) {
      Alert.alert(t('common.error'), e.message || 'Failed to submit story');
    } finally {
      setIsSubmitting(false);
    }
  }

  function ChipRow<T extends string>({ values, selected, onSelect, labelFn }: {
    values: T[]; selected: T; onSelect: (v: T) => void; labelFn?: (v: T) => string;
  }) {
    return (
      <View style={styles.chipRow}>
        {values.map((v) => (
          <TouchableOpacity
            key={v}
            style={[styles.chip, selected === v && styles.chipActive]}
            onPress={() => onSelect(v)}
          >
            <Text style={[styles.chipText, selected === v && styles.chipTextActive]}>
              {labelFn ? labelFn(v) : v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('write.title')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('write.titleLabel')}</Text>
          <TextInput style={styles.input} placeholder={t('write.titlePlaceholder')} value={title} onChangeText={setTitle} maxLength={100} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('write.storyLabel')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('write.storyPlaceholder')}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('write.summaryLabel')} <Text style={styles.optional}>({t('write.summaryOptional')})</Text></Text>
          <TextInput style={[styles.input, styles.summaryInput]} placeholder={t('write.summaryPlaceholder')} value={summary} onChangeText={setSummary} multiline textAlignVertical="top" maxLength={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('common.theme')}</Text>
          <ChipRow values={THEMES as any} selected={theme} onSelect={setTheme}
            labelFn={(v) => t(`common.${v}` as any)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('common.difficulty')}</Text>
          <ChipRow values={DIFFICULTIES} selected={difficulty} onSelect={setDifficulty}
            labelFn={(v) => t(`common.${v}` as any)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('common.language')}</Text>
          <View style={styles.chipRow}>
            {LANGUAGES.map(({ code, label }) => (
              <TouchableOpacity
                key={code}
                style={[styles.chip, language === code && styles.chipActive]}
                onPress={() => setLanguage(code)}
              >
                <Text style={[styles.chipText, language === code && styles.chipTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.label}>{t('common.shareWithCommunity')}</Text>
              <Text style={styles.toggleSub}>{isPublic ? t('common.visibleToEveryone') : t('common.onlyYouCanSee')}</Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#D1D5DB', true: Colors.primaryLight }}
              thumbColor={isPublic ? Colors.primary : '#9CA3AF'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting || !canSubmit}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>{isPublic ? t('write.publish') : t('write.savePrivate')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 16, color: Colors.primary, fontWeight: '700' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  optional: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  textArea: { height: 180, paddingTop: 12 },
  summaryInput: { height: 80, paddingTop: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  chipText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.primary, fontWeight: '800' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderWidth: 2, borderColor: Colors.border },
  toggleSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: Colors.white, fontSize: 17, fontWeight: '900' },
});
