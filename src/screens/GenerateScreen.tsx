import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateStory } from '../api/generate';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../constants/colors';
import { Theme, Difficulty, AgeGroup, Language } from '../types';

const THEMES: { value: Theme; label: string; emoji: string }[] = [
  { value: 'friendship', label: 'Friendship', emoji: '🤝' },
  { value: 'adventure', label: 'Adventure', emoji: '🗺️' },
  { value: 'kindness', label: 'Kindness', emoji: '💛' },
  { value: 'courage', label: 'Courage', emoji: '🦁' },
  { value: 'animals', label: 'Animals', emoji: '🐾' },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: '5-7', label: 'Ages 5-7' },
  { value: '8-10', label: 'Ages 8-10' },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
];

export default function GenerateScreen() {
  const { loadStories } = useAppStore();

  const [theme, setTheme] = useState<Theme>('adventure');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('5-7');
  const [language, setLanguage] = useState<Language>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      await generateStory({
        theme,
        difficulty,
        age_group: ageGroup,
        language,
      });
      setSuccess(true);
      loadStories();
    } catch (e: any) {
      setError(e.message || 'Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create a Story</Text>
        <Text style={styles.subtitle}>
          AI will write a new story just for you!
        </Text>

        <Text style={styles.sectionLabel}>Theme</Text>
        <View style={styles.pillRow}>
          {THEMES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.pill, theme === t.value && styles.pillActive]}
              onPress={() => setTheme(t.value)}
            >
              <Text style={styles.pillEmoji}>{t.emoji}</Text>
              <Text style={[styles.pillText, theme === t.value && styles.pillTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Difficulty</Text>
        <View style={styles.pillRow}>
          {DIFFICULTIES.map((d) => (
            <TouchableOpacity
              key={d.value}
              style={[styles.pill, difficulty === d.value && styles.pillActive]}
              onPress={() => setDifficulty(d.value)}
            >
              <Text style={[styles.pillText, difficulty === d.value && styles.pillTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Age Group</Text>
        <View style={styles.pillRow}>
          {AGE_GROUPS.map((a) => (
            <TouchableOpacity
              key={a.value}
              style={[styles.pill, ageGroup === a.value && styles.pillActive]}
              onPress={() => setAgeGroup(a.value)}
            >
              <Text style={[styles.pillText, ageGroup === a.value && styles.pillTextActive]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Language</Text>
        <View style={styles.pillRow}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.value}
              style={[styles.pill, language === l.value && styles.pillActive]}
              onPress={() => setLanguage(l.value)}
            >
              <Text style={[styles.pillText, language === l.value && styles.pillTextActive]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Story created! Check the home screen.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating}
          activeOpacity={0.85}
        >
          {isGenerating ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={Colors.white} size="small" />
              <Text style={styles.generateBtnText}>Creating story...</Text>
            </View>
          ) : (
            <Text style={styles.generateBtnText}>Generate Story ✨</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    marginTop: 16,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 6,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillEmoji: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  pillTextActive: {
    color: Colors.white,
  },
  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.optionWrong,
  },
  errorText: {
    color: Colors.optionWrong,
    fontSize: 14,
    fontWeight: '600',
  },
  successBox: {
    backgroundColor: '#F0FFF0',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.optionCorrect,
  },
  successText: {
    color: Colors.optionCorrect,
    fontSize: 14,
    fontWeight: '600',
  },
  generateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 28,
  },
  generateBtnDisabled: {
    opacity: 0.7,
  },
  generateBtnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
