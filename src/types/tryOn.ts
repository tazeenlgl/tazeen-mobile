export type TryOnStage =
  | 'capture'
  | 'preview'
  | 'processing'
  | 'result';

// Raw signals evaluated continuously from the live camera frame.
// Internal only — never shown to the customer directly.
export type FaceCaptureMetrics = {
  faceCount: number;
  faceWidthRatio: number; // face width / frame width
  centerOffsetRatio: number; // distance from frame center / frame width
  yaw: number;
  pitch: number;
  roll: number;
  leftEyeOpen: number;
  rightEyeOpen: number;
  brightness: number; // 0-1 estimate
};

export type FaceCaptureStatus =
  | 'no_face'
  | 'too_small'
  | 'too_large'
  | 'off_center'
  | 'turned'
  | 'tilted'
  | 'low_light'
  | 'obstructed'
  | 'valid';

export type FaceCaptureQuality = {
  status: FaceCaptureStatus;
  message: string;
  isValid: boolean;
};

// Input to the future AI face-replacement pipeline. Mock-only today —
// `generateTryOnResult` below returns the model image unchanged.
export type TryOnRequest = {
  customerFaceUri: string;
  tryOnModelImage: string;
  productId: string;
};

export type TryOnResult = {
  resultImage: string;
  productId: string;
};
