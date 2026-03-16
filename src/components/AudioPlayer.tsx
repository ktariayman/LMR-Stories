import React, { useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { Colors } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';
import { Language } from '../types';

interface AudioPlayerProps {
  text: string;
  language: Language;
}

const LANG_MAP: Record<Language, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar-SA',
};

export default function AudioPlayer({ text, language }: AudioPlayerProps) {
  const isPlaying = useAppStore((s) => s.isPlaying);
  const setIsPlaying = useAppStore((s) => s.setIsPlaying);

  useEffect(() => {
    return () => {
      Speech.stop();
      setIsPlaying(false);
    };
  }, []);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    Speech.speak(text, {
      language: LANG_MAP[language],
      rate: 0.85,
      pitch: 1.0,
      onDone: () => setIsPlaying(false),
      onStopped: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
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
          {isPlaying ? 'Stop Reading' : 'Read Aloud'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 10,
  },
  buttonActive: {
    backgroundColor: Colors.primary,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
  },
  labelActive: {
    color: Colors.white,
  },
});
