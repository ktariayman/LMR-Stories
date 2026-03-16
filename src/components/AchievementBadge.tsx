import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const earned = achievement.earned;

  return (
    <View style={[styles.badge, !earned && styles.badgeLocked]}>
      <Text style={styles.emoji}>{earned ? achievement.emoji : '🔒'}</Text>
      <View style={styles.info}>
        <Text style={[styles.title, !earned && styles.textLocked]}>
          {achievement.title}
        </Text>
        <Text style={[styles.description, !earned && styles.textLocked]}>
          {achievement.description}
        </Text>
      </View>
      {earned && <Text style={styles.checkmark}>✅</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.starFilled,
    gap: 12,
  },
  badgeLocked: {
    borderColor: Colors.optionBorder,
    opacity: 0.6,
  },
  emoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  textLocked: {
    color: Colors.textSecondary,
  },
  checkmark: {
    fontSize: 20,
  },
});
