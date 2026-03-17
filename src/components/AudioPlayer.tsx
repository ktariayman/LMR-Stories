import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Colors } from '../constants/colors';
import { useAppStore } from '../store/useAppStore';

interface AudioPlayerProps {
  text: string;
  audioBase64?: string | null;
}

export default function AudioPlayer({ text, audioBase64 }: AudioPlayerProps) {
  const isPlaying = useAppStore((s) => s.isPlaying);
  const setIsPlaying = useAppStore((s) => s.setIsPlaying);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      setIsPlaying(false);
    };
  }, []);

  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
      setIsPlaying(false);
      return;
    }

    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      return;
    }

    if (!audioBase64) {
      // Fallback or handle missing audio
      return;
    }

    try {
      setLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${audioBase64}` },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          sound.setPositionAsync(0);
          sound.pauseAsync();
        }
      });

      setIsPlaying(true);
    } catch (error) {
      console.error('Playback Error:', error);
    } finally {
      setLoading(false);
    }
  }, [isPlaying, audioBase64]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPlaying && styles.buttonActive]}
        onPress={handlePlay}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <>
            <Text style={styles.icon}>{isPlaying ? '⏸️' : '🔊'}</Text>
            <Text style={[styles.label, isPlaying && styles.labelActive]}>
              {isPlaying ? 'Stop Reading' : 'Read Aloud (Human Voice)'}
            </Text>
          </>
        )}
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
    minHeight: 56,
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
