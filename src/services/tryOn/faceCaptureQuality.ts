import type { FaceCaptureMetrics, FaceCaptureQuality } from '../../types/tryOn';

const MIN_FACE_WIDTH_RATIO = 0.28;
const MAX_FACE_WIDTH_RATIO = 0.62;
const MAX_CENTER_OFFSET_RATIO = 0.12;
const MAX_YAW = 15;
const MAX_PITCH = 15;
const MAX_ROLL = 12;
const MIN_EYE_OPEN = 0.4;
const MIN_BRIGHTNESS = 0.25;

// Converts raw face-detection signals into a single human-readable
// capture status. Checked in priority order so only one issue is
// surfaced to the customer at a time.
export function assessFaceCapture(
  metrics: FaceCaptureMetrics | null,
): FaceCaptureQuality {
  if (!metrics || metrics.faceCount === 0) {
    return invalid('no_face', 'Position your face inside the guide');
  }
  if (metrics.faceCount > 1) {
    return invalid('obstructed', 'Make sure your face is clearly visible');
  }
  if (metrics.brightness < MIN_BRIGHTNESS) {
    return invalid('low_light', 'Move somewhere brighter');
  }
  if (
    metrics.leftEyeOpen < MIN_EYE_OPEN ||
    metrics.rightEyeOpen < MIN_EYE_OPEN
  ) {
    return invalid('obstructed', 'Make sure your face is clearly visible');
  }
  if (metrics.faceWidthRatio < MIN_FACE_WIDTH_RATIO) {
    return invalid('too_small', 'Move closer');
  }
  if (metrics.faceWidthRatio > MAX_FACE_WIDTH_RATIO) {
    return invalid('too_large', 'Move slightly back');
  }
  if (metrics.centerOffsetRatio > MAX_CENTER_OFFSET_RATIO) {
    return invalid('off_center', 'Center your face');
  }
  if (Math.abs(metrics.yaw) > MAX_YAW || Math.abs(metrics.pitch) > MAX_PITCH) {
    return invalid('turned', 'Look straight at the camera');
  }
  if (Math.abs(metrics.roll) > MAX_ROLL) {
    return invalid('tilted', 'Keep your head straight');
  }
  return { status: 'valid', message: 'Perfect — hold still', isValid: true };
}

function invalid(
  status: FaceCaptureQuality['status'],
  message: string,
): FaceCaptureQuality {
  return { status, message, isValid: false };
}
