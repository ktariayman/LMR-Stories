import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StoryListItem } from '../types';
import { Colors } from '../constants/colors';

interface StoryCardProps {
  story: StoryListItem;
  isCompleted: boolean;
  onPress: () => void;
}

export default function StoryCard({ story, isCompleted, onPress }: StoryCardProps) {
  const difficultyColor =
    story.difficulty === 'easy' ? Colors.easyBadge : Colors.mediumBadge;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓</Text>
        </View>
      )}
      <View style={styles.topRow}>
        <Text style={styles.emoji}>{story.theme_emoji}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>
      </View>
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: difficultyColor }]}>
          <Text style={styles.badgeText} allowFontScaling={false}>
            {story.difficulty.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: Colors.ageBadge }]}>
          <Text style={styles.badgeText} allowFontScaling={false}>
            Age {story.age_group}
          </Text>
        </View>
      </View>
      <Text style={styles.summary} numberOfLines={2}>
        {story.summary}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.easyBadge,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  completedText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 36,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
