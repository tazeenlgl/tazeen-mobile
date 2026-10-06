import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { GameModule } from '../../types/game';

type PrimaryGameCardProps = {
  game: GameModule;
  onPress: () => void;
};

export default function PrimaryGameCard({
  game,
  onPress,
}: PrimaryGameCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.ribbon} />

      <View style={styles.topRow}>
        <View style={styles.iconBubble}>
          <Text style={styles.icon}>{game.icon}</Text>
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.subtitle}>{game.subtitle}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.supporting}>{game.supportingText}</Text>
        <Pressable style={styles.cta} onPress={onPress}>
          <Text style={styles.ctaText}>{game.actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.giftCardDeep,
    borderRadius: 22,
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  ribbon: {
    position: 'absolute',
    top: -40,
    right: 20,
    width: 90,
    height: 260,
    backgroundColor: 'rgba(217, 184, 115, 0.14)',
    transform: [{ rotate: '18deg' }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supporting: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.giftCardAccent,
  },
  cta: {
    backgroundColor: colors.giftCardAccent,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.giftCardDeep,
    letterSpacing: 0.5,
  },
});
