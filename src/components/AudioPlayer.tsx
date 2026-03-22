import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { Colors } from '../constants/colors';
import { useTranslation } from '../i18n';

interface AudioPlayerProps {
  text: string;
  language?: string;
}

const LANG_LOCALE: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar-SA',
};

export default function AudioPlayer({ text, language = 'en' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      await Speech.stop();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    Speech.speak(text, {
      language: LANG_LOCALE[language] ?? 'en-US',
      rate: 0.85,
      onDone: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
      onStopped: () => setIsPlaying(false),
    });
  }, [isPlaying, text, language]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPlaying && styles.buttonActive]}
        onPress={handlePlay}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>{isPlaying ? '⏸️' : '🔊'}</Text>
        <Text style={[styles.label, isPlaying && styles.labelActive]}>
          {isPlaying ? t('story.stopReading') : t('story.readAloud')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.primary,
    borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24, gap: 10, minHeight: 56,
  },
  buttonActive: { backgroundColor: Colors.primary },
  icon: { fontSize: 22 },
  label: { fontSize: 17, fontWeight: '700', color: Colors.primary },
  labelActive: { color: Colors.white },
});
