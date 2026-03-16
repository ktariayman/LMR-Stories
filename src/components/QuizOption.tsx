import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

type OptionState = 'default' | 'selected' | 'correct' | 'wrong';

interface QuizOptionProps {
  text: string;
  state: OptionState;
  onPress: () => void;
  disabled: boolean;
}

export default function QuizOption({ text, state, onPress, disabled }: QuizOptionProps) {
  const bgColor = {
    default: Colors.optionDefault,
    selected: Colors.optionSelected,
    correct: Colors.optionCorrect,
    wrong: Colors.optionWrong,
  }[state];

  const borderColor = {
    default: Colors.optionBorder,
    selected: Colors.primaryDark,
    correct: '#388E3C',
    wrong: '#C62828',
  }[state];

  const textColor =
    state === 'default' ? Colors.textPrimary : Colors.white;

  return (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: bgColor, borderColor }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={[styles.text, { color: textColor }]} allowFontScaling={false}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
});
