import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StoryListItem } from '../types';
import { Colors, THEME_COLORS } from '../constants/colors';
import { useTranslation } from '../i18n';

interface StoryCardProps {
  story: StoryListItem;
  isCompleted: boolean;
  onPress: () => void;
}

const DIFF_COLORS: Record<string, string> = {
  easy: Colors.easyBadge,
  medium: Colors.mediumBadge,
  hard: '#EF4444',
};

const DIFF_KEYS: Record<string, string> = {
  easy: 'common.easy',
  medium: 'common.medium',
  hard: 'common.hard',
};

export default function StoryCard({ story, isCompleted, onPress }: StoryCardProps) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  const difficultyColor = DIFF_COLORS[story.difficulty] ?? Colors.mediumBadge;
  const cardBg = THEME_COLORS[story.theme] ?? Colors.cardBackground;
  const isCommunity = story.story_type === 'community';
  const hasCover = !!story.cover_image && !imgError;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓</Text>
        </View>
      )}

      {hasCover && (
        <Image
          source={{ uri: story.cover_image! }}
          style={styles.coverImage}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      )}

      <View style={styles.topRow}>
        {!hasCover && <Text style={styles.emoji}>{story.theme_emoji}</Text>}
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: difficultyColor }]}>
          <Text style={styles.badgeText} allowFontScaling={false}>
            {t((DIFF_KEYS[story.difficulty] || 'common.easy') as any).toUpperCase()}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: Colors.ageBadge }]}>
          <Text style={styles.badgeText} allowFontScaling={false}>
            {t('story.age' as any, { group: story.age_group })}
          </Text>
        </View>
        {isCommunity && (
          <View style={styles.communityBadge}>
            <Text style={styles.communityBadgeText} allowFontScaling={false}>
              {t('common.community' as any)}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.summary} numberOfLines={2}>
        {story.summary}
      </Text>

      {isCommunity && (
        <View style={styles.footerRow}>
          {story.author_username ? (
            <Text style={styles.authorText}>@{story.author_username}</Text>
          ) : null}
          {typeof story.vote_count === 'number' && story.vote_count > 0 ? (
            <View style={styles.voteChip}>
              <Text style={styles.voteText}>❤️ {story.vote_count}</Text>
            </View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: Colors.border,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  completedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.easyBadge,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  completedText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 36,
  },
  emoji: {
    fontSize: 36,
    marginRight: 14,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 27,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
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
  communityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.communityBadgeLight,
  },
  communityBadgeText: {
    color: Colors.communityBadge,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  summary: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  authorText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  voteChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  voteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
});
