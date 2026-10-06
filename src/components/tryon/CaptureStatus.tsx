import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type CaptureStatusProps = {
  message: string;
  isValid: boolean;
  countdown: number | null;
};

export default function CaptureStatus({
  message,
  isValid,
  countdown,
}: CaptureStatusProps) {
  return (
    <View style={[styles.pill, isValid && styles.pillValid]}>
      <Text style={[styles.text, isValid && styles.textValid]}>
        {message}
        {countdown !== null ? ` · ${countdown}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    backgroundColor: colors.glassDark,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  pillValid: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  textValid: {
    color: colors.white,
  },
});
