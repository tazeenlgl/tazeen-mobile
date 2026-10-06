import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const SEGMENT_COLORS = [
  colors.primary,
  colors.giftCardAccent,
  colors.amber,
  colors.deepGreen,
  colors.primaryDark,
  colors.softAmberBorder,
];

const PRIZES = ['₹50 Off', '₹100 Off', 'Free Delivery', '5% Cashback', 'Try Again', '₹25 Wallet'];

type SpinWinGameScreenProps = {
  onBack: () => void;
};

export default function SpinWinGameScreen({ onBack }: SpinWinGameScreenProps) {
  const insets = useSafeAreaInsets();
  const rotation = useRef(new Animated.Value(0)).current;
  const totalTurns = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSpin = () => {
    if (spinning) {
      return;
    }
    setPrize(null);
    setSpinning(true);
    const extraTurns = 4 + Math.floor(Math.random() * 3);
    totalTurns.current += extraTurns;
    Animated.timing(rotation, {
      toValue: totalTurns.current,
      duration: 2200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSpinning(false);
      const won = PRIZES[Math.floor(Math.random() * PRIZES.length)];
      setPrize(won);
    });
  };

  return (
    <View style={styles.flex}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>{'‹'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Spin & Win</Text>
        </View>

        <View style={styles.center}>
          <Text style={styles.pointer}>▼</Text>
          <Animated.View
            style={[styles.wheel, { transform: [{ rotate: spin }] }]}
          >
            {SEGMENT_COLORS.map((color, index) => (
              <View
                key={index}
                style={[
                  styles.segmentPivot,
                  { transform: [{ rotate: `${index * 60}deg` }] },
                ]}
              >
                <View style={[styles.segment, { backgroundColor: color }]} />
              </View>
            ))}
            <View style={styles.hub}>
              <Text style={styles.hubText}>SPIN</Text>
            </View>
          </Animated.View>

          {prize && (
            <View style={styles.resultBanner}>
              <Text style={styles.resultText}>🎉 You won {prize}!</Text>
            </View>
          )}

          {!prize && (
            <Text style={styles.supportingText}>Daily rewards available</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.secondaryButton} onPress={onBack}>
            <Text style={styles.secondaryButtonText}>Game Hub</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, spinning && styles.disabledButton]}
            onPress={handleSpin}
            disabled={spinning}
          >
            <Text style={styles.primaryButtonText}>
              {spinning ? 'Spinning…' : 'SPIN NOW'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const WHEEL_SIZE = 220;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  backIcon: {
    fontSize: 24,
    color: colors.heading,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.heading,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointer: {
    fontSize: 22,
    color: colors.primary,
    marginBottom: -6,
    zIndex: 1,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  segmentPivot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  segment: {
    position: 'absolute',
    width: WHEEL_SIZE / 2 - 28,
    height: 6,
    left: WHEEL_SIZE / 2,
    top: WHEEL_SIZE / 2 - 3,
    borderRadius: 3,
  },
  hub: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.giftCardDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.giftCardAccent,
    letterSpacing: 1,
  },
  supportingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  resultBanner: {
    backgroundColor: colors.softGreen,
    borderWidth: 1,
    borderColor: colors.softGreenBorder,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.heading,
  },
  footer: {
    flexDirection: 'row',
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.amber,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
