import type { TryOnRequest, TryOnResult } from '../../types/tryOn';

// Mock-only. Replace this body with a real call once the backend AI
// face-replacement pipeline exists:
//   customerFaceUri + tryOnModelImage -> backend -> AI face swap -> resultImage
// The request/result shape is already backend-ready so screens do not
// need to change when the real pipeline is wired in.
export async function generateTryOnResult(
  request: TryOnRequest,
): Promise<TryOnResult> {
  await new Promise<void>(resolve => setTimeout(resolve, 1800));
  return {
    resultImage: request.tryOnModelImage,
    productId: request.productId,
  };
}
