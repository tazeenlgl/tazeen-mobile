import { NativeModules, Platform } from 'react-native';

// Truecaller OAuth (PKCE). The native module returns the authorization code;
// the code is exchanged for a token and the profile here. PKCE means no client
// secret is needed. Docs: https://docs.truecaller.com/truecaller-sdk
const TOKEN_URL = 'https://oauth-account-noneu.truecaller.com/v1/token';
const USERINFO_URL = 'https://oauth-account-noneu.truecaller.com/v1/userinfo';

type NativeTruecaller = {
  isConfigured(): Promise<boolean>;
  authorize(): Promise<{
    authorizationCode: string;
    codeVerifier: string;
    clientId: string;
  }>;
};

export type TruecallerProfile = {
  // 10-digit Indian mobile number, without the country code.
  phone: string;
  firstName: string;
  lastName: string;
  email?: string;
};

export type TruecallerResult =
  | { ok: true; profile: TruecallerProfile }
  // `fallback` means: send the shopper to the normal phone + PIN login.
  | { ok: false; message: string; fallback: boolean; cancelled?: boolean };

const native: NativeTruecaller | undefined = NativeModules.TruecallerAuth;

// Truecaller error codes the shopper triggers themselves (declined/dismissed).
const CANCEL_CODES = ['TC_2', 'TC_11', 'TC_14'];

const toLocalPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
};

export async function signInWithTruecaller(): Promise<TruecallerResult> {
  if (Platform.OS !== 'android' || !native) {
    return { ok: false, message: 'Truecaller sign-in is not available on this device.', fallback: true };
  }
  if (!(await native.isConfigured())) {
    return {
      ok: false,
      message: 'Truecaller sign-in is not set up yet. Please log in with your phone number and PIN.',
      fallback: true,
    };
  }

  try {
    const auth = await native.authorize();

    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:
        `grant_type=authorization_code&client_id=${encodeURIComponent(auth.clientId)}` +
        `&code=${encodeURIComponent(auth.authorizationCode)}` +
        `&code_verifier=${encodeURIComponent(auth.codeVerifier)}`,
    });
    if (!tokenResponse.ok) {
      throw new Error('token');
    }
    const token = (await tokenResponse.json()) as { access_token: string };

    const profileResponse = await fetch(USERINFO_URL, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!profileResponse.ok) {
      throw new Error('profile');
    }
    const info = (await profileResponse.json()) as {
      phone_number?: string;
      given_name?: string;
      family_name?: string;
      email?: string;
    };
    const phone = toLocalPhone(info.phone_number ?? '');
    if (phone.length !== 10) {
      throw new Error('phone');
    }
    return {
      ok: true,
      profile: {
        phone,
        firstName: info.given_name ?? '',
        lastName: info.family_name ?? '',
        email: info.email,
      },
    };
  } catch (error) {
    const code = (error as { code?: string }).code ?? '';
    if (CANCEL_CODES.includes(code)) {
      return { ok: false, message: '', fallback: false, cancelled: true };
    }
    const unavailable = code === 'NOT_AVAILABLE' || code === 'TC_5';
    return {
      ok: false,
      message: unavailable
        ? 'Truecaller is not installed or signed in on this phone.'
        : 'Truecaller sign-in did not work. Please try again or use your phone number and PIN.',
      fallback: true,
    };
  }
}
