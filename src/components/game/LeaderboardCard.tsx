import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type LeaderboardCardProps = {
  onPress: () => void;
};

export default function LeaderboardCard({ onPress }: LeaderboardCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBubble}>
        <Text style={styles.icon}>🏆</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>Today's Leaderboard</Text>
        <Text style={styles.subtitle}>See who won today</Text>
      </View>

      <Pressable style={styles.cta} onPress={onPress}>
        <Text style={styles.ctaText}>VIEW</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 24,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 11,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginLeft: 8,
  },
  ctaText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
});
