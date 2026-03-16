import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StarRatingProps {
  score: number;
  total: number;
}

export default function StarRating({ score, total }: StarRatingProps) {
  const starCount = score === total ? 3 : score === total - 1 ? 2 : 1;

  return (
    <View style={styles.row}>
      {[1, 2, 3].map((i) => (
        <Text key={i} style={[styles.star, i <= starCount ? styles.filled : styles.empty]}>
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  star: {
    fontSize: 44,
  },
  filled: {
    color: '#FFD700',
  },
  empty: {
    color: '#E0E0E0',
  },
});
