import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { GameModule } from '../../types/game';

type CompactGameCardProps = {
  game: GameModule;
  onPress: () => void;
};

export default function CompactGameCard({
  game,
  onPress,
}: CompactGameCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBubble, { backgroundColor: colors.softAmber }]}>
        <Text style={styles.icon}>{game.icon}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {game.subtitle}
        </Text>
      </View>

      <Pressable style={styles.cta} onPress={onPress}>
        <Text style={styles.ctaText}>{game.actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
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
    backgroundColor: colors.amber,
    borderRadius: 11,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginLeft: 8,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.3,
  },
});
