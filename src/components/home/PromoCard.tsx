import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type PromoCardProps = {
  title: string;
};

export default function PromoCard({ title }: PromoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.glassHighlight}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 140,
    borderRadius: 24,
    backgroundColor: colors.softGreen,
    borderWidth: 1,
    borderColor: colors.softGreenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  glassHighlight: {
    backgroundColor: colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.deepGreen,
    textAlign: 'center',
  },
});
