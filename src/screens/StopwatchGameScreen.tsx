import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const WIN_TOLERANCE_SECONDS = 0.2;
const MIN_TARGET_SECONDS = 3;
const MAX_TARGET_SECONDS = 7;

function randomTarget(): number {
  const span = MAX_TARGET_SECONDS - MIN_TARGET_SECONDS;
  return Math.round((MIN_TARGET_SECONDS + Math.random() * span) * 100) / 100;
}

function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(2) + 's';
}

type StopwatchGameScreenProps = {
  onBack: () => void;
};

export default function StopwatchGameScreen({
  onBack,
}: StopwatchGameScreenProps) {
  const insets = useSafeAreaInsets();
  const [target, setTarget] = useState(randomTarget);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setResult(null);
    setElapsedMs(0);
    startedAtRef.current = Date.now();
    setRunning(true);
    intervalRef.current = setInterval(() => {
      if (startedAtRef.current) {
        setElapsedMs(Date.now() - startedAtRef.current);
      }
    }, 30);
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    const finalElapsed = startedAtRef.current
      ? Date.now() - startedAtRef.current
      : elapsedMs;
    setElapsedMs(finalElapsed);
    const diff = Math.abs(finalElapsed / 1000 - target);
    setResult(diff <= WIN_TOLERANCE_SECONDS ? 'win' : 'lose');
  };

  const handlePlayAgain = () => {
    setTarget(randomTarget());
    setElapsedMs(0);
    setResult(null);
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
          <Text style={styles.headerTitle}>Stop & Win</Text>
        </View>

        <View style={styles.center}>
          <Text style={styles.targetLabel}>Today's Target</Text>
          <Text style={styles.targetValue}>{target.toFixed(2)}s</Text>

          <View style={styles.timerCard}>
            <Text style={styles.timerValue}>{formatSeconds(elapsedMs)}</Text>
          </View>

          {result && (
            <View
              style={[
                styles.resultBanner,
                result === 'win' ? styles.resultWin : styles.resultLose,
              ]}
            >
              <Text style={styles.resultText}>
                {result === 'win'
                  ? '🎉 You Won! Reward: ₹100'
                  : `Missed by ${Math.abs(
                      elapsedMs / 1000 - target,
                    ).toFixed(2)}s — Try Again`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {result ? (
            <>
              <Pressable style={styles.secondaryButton} onPress={onBack}>
                <Text style={styles.secondaryButtonText}>Game Hub</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handlePlayAgain}>
                <Text style={styles.primaryButtonText}>Play Again</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={[styles.primaryButton, styles.fullWidthButton]}
              onPress={running ? handleStop : handleStart}
            >
              <Text style={styles.primaryButtonText}>
                {running ? 'STOP' : 'START'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

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
  targetLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  targetValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 28,
  },
  timerCard: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.giftCardDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
  },
  resultBanner: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  resultWin: {
    backgroundColor: colors.softGreen,
    borderWidth: 1,
    borderColor: colors.softGreenBorder,
  },
  resultLose: {
    backgroundColor: colors.softAmber,
    borderWidth: 1,
    borderColor: colors.softAmberBorder,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.heading,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
  },
  fullWidthButton: {
    flex: 1,
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
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
