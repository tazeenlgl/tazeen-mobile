import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import FaceGuide from '../components/tryon/FaceGuide';
import CaptureStatus from '../components/tryon/CaptureStatus';
import TryOnCamera, {
  type TryOnCameraHandle,
} from '../components/tryon/TryOnCamera';
import type { FaceCaptureQuality } from '../types/tryOn';

const HOLD_DURATION_MS = 1500;
const TICK_MS = 100;

type SuitTryOnCaptureScreenProps = {
  onBack: () => void;
  onCaptured: (photoUri: string) => void;
};

export default function SuitTryOnCaptureScreen({
  onBack,
  onCaptured,
}: SuitTryOnCaptureScreenProps) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<TryOnCameraHandle>(null);
  const [quality, setQuality] = useState<FaceCaptureQuality>({
    status: 'no_face',
    message: 'Position your face inside the guide',
    isValid: false,
  });
  const [heldMs, setHeldMs] = useState(0);
  const capturingRef = useRef(false);

  useEffect(() => {
    if (!quality.isValid) {
      setHeldMs(0);
      return;
    }
    const interval = setInterval(() => {
      setHeldMs(current => current + TICK_MS);
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [quality.isValid]);

  useEffect(() => {
    if (heldMs < HOLD_DURATION_MS || capturingRef.current) {
      return;
    }
    capturingRef.current = true;
    cameraRef.current?.capture().then(uri => {
      if (uri) {
        onCaptured(uri);
      } else {
        capturingRef.current = false;
      }
    });
  }, [heldMs, onCaptured]);

  const countdown = quality.isValid
    ? Math.max(1, Math.ceil((HOLD_DURATION_MS - heldMs) / 1000))
    : null;

  return (
    <View style={styles.flex}>
      <TryOnCamera active onQualityChange={setQuality} ref={cameraRef} />
      <FaceGuide isValid={quality.isValid} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.title}>Try It On</Text>
      </View>

      <Text style={styles.instruction}>
        Center your face in the guide — capture happens automatically
      </Text>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <CaptureStatus
          message={quality.message}
          isValid={quality.isValid}
          countdown={countdown}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.heading,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  backIcon: {
    fontSize: 26,
    color: colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  instruction: {
    position: 'absolute',
    top: 100,
    left: 24,
    right: 24,
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.85,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
  },
});
