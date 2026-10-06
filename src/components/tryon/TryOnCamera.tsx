import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  type CameraRef,
} from 'react-native-vision-camera';
import { Camera, type Face } from 'react-native-vision-camera-face-detector';
import { colors } from '../../theme/colors';
import { assessFaceCapture } from '../../services/tryOn/faceCaptureQuality';
import type { FaceCaptureMetrics, FaceCaptureQuality } from '../../types/tryOn';

export type TryOnCameraHandle = {
  capture: () => Promise<string | null>;
};

type TryOnCameraProps = {
  active: boolean;
  onQualityChange: (quality: FaceCaptureQuality) => void;
};

const TryOnCamera = forwardRef<TryOnCameraHandle, TryOnCameraProps>(
  function TryOnCamera({ active, onQualityChange }, ref) {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('front');
    const [requested, setRequested] = useState(false);
    const cameraRef = useRef<CameraRef>(null);

    useImperativeHandle(ref, () => ({
      capture: async () => {
        if (!cameraRef.current) {
          return null;
        }
        const image = await cameraRef.current.takeSnapshot();
        const path = await image.saveToTemporaryFileAsync('jpg', 90);
        return `file://${path}`;
      },
    }));

    useEffect(() => {
      if (!hasPermission && !requested) {
        setRequested(true);
        requestPermission();
      }
    }, [hasPermission, requested, requestPermission]);

    const handleError = useCallback(() => {
      onQualityChange(assessFaceCapture(null));
    }, [onQualityChange]);

    const handleFacesDetected = useCallback(
      (faces: Face[]) => {
        if (faces.length === 0) {
          onQualityChange(assessFaceCapture(null));
          return;
        }
        const face = faces[0];
        const frameWidth = face.frameWidth;
        const faceCenterX = face.bounds.x + face.bounds.width / 2;
        const frameCenterX = frameWidth / 2;
        const metrics: FaceCaptureMetrics = {
          faceCount: faces.length,
          faceWidthRatio: face.bounds.width / frameWidth,
          centerOffsetRatio: Math.abs(faceCenterX - frameCenterX) / frameWidth,
          yaw: face.yawAngle,
          pitch: face.pitchAngle,
          roll: face.rollAngle,
          leftEyeOpen: face.leftEyeOpenProbability ?? 1,
          rightEyeOpen: face.rightEyeOpenProbability ?? 1,
          brightness: 0.6,
        };
        onQualityChange(assessFaceCapture(metrics));
      },
      [onQualityChange],
    );

    if (!hasPermission) {
      return (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>
            Camera permission is required for Try It On.
          </Text>
        </View>
      );
    }

    if (!device) {
      return (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>No front camera available.</Text>
        </View>
      );
    }

    return (
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={active}
        performanceMode="fast"
        onFacesDetected={handleFacesDetected}
        onError={handleError}
      />
    );
  },
);

export default TryOnCamera;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassDark,
    paddingHorizontal: 30,
  },
  fallbackText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
