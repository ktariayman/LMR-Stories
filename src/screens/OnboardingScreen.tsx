import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  FlatList, ViewToken,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useTranslation } from '../i18n';

const { width } = Dimensions.get('window');

interface OnboardingProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    emoji: '📚',
    titleKey: 'onboarding.slide1Title',
    descKey: 'onboarding.slide1Desc',
    bg: '#E3F2FD',
  },
  {
    emoji: '🌍',
    titleKey: 'onboarding.slide2Title',
    descKey: 'onboarding.slide2Desc',
    bg: '#E8F5E9',
  },
  {
    emoji: '🏆',
    titleKey: 'onboarding.slide3Title',
    descKey: 'onboarding.slide3Desc',
    bg: '#FFF3E0',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  function handleNext() {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg }]}>
            <Text style={styles.slideEmoji}>{item.emoji}</Text>
            <Text style={styles.slideTitle}>{t(item.titleKey as any)}</Text>
            <Text style={styles.slideDesc}>{t(item.descKey as any)}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, currentIndex === i && styles.dotActive]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {currentIndex < SLIDES.length - 1 ? (
          <>
            <TouchableOpacity onPress={onComplete}>
              <Text style={styles.skipText}>{t('onboarding.skip' as any)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>{t('onboarding.next' as any)}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.startBtn} onPress={onComplete}>
            <Text style={styles.startText}>{t('onboarding.getStarted' as any)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDesc: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.progressTrack,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 28,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  skipText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  nextText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  startBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  startText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
});
