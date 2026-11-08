import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { signInWithTruecaller } from '../services/auth/truecaller';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <View style={styles.eyeIconContainer}>
      <View
        style={[
          styles.eyeOuter,
          visible ? styles.eyeOuterOpen : styles.eyeOuterClosed,
        ]}
      >
        {visible && <View style={styles.eyePupil} />}
      </View>
    </View>
  );
}

type LoginScreenProps = {
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onLogin?: () => void;
  onNavigate?: (key: string) => void;
};

export default function LoginScreen({
  onForgotPassword,
  onSignUp,
  onLogin,
  onNavigate,
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [truecallerBusy, setTruecallerBusy] = useState(false);
  const [truecallerError, setTruecallerError] = useState('');
  const [pinVisible, setPinVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [pinFocused, setPinFocused] = useState(false);

  // Mock auth: record what was entered so later screens (Change PIN,
  // Change number) can verify against it. Nothing is validated server-side.
  const handleTruecaller = async () => {
    if (truecallerBusy) {
      return;
    }
    setTruecallerBusy(true);
    setTruecallerError('');
    const result = await signInWithTruecaller();
    setTruecallerBusy(false);
    if (result.ok) {
      // Truecaller verified the number, so no PIN is set for this session.
      login(result.profile.phone, '');
      onLogin?.();
    } else if (!result.cancelled) {
      setTruecallerError(result.message);
    }
  };

  const handleLogin = () => {
    login(phone, pin);
    onLogin?.();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Tazeen</Text>
        </View>

        <View style={styles.main}>
          <Text style={styles.greeting}>Hi!</Text>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.subtitle}>
            I'm waiting for you, please enter your detail
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                phoneFocused && styles.inputFocused,
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.placeholder}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PIN</Text>
            <View
              style={[
                styles.input,
                styles.pinRow,
                pinFocused && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.pinInput}
                placeholder="Enter your PIN"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                secureTextEntry={!pinVisible}
                value={pin}
                onChangeText={setPin}
                onFocus={() => setPinFocused(true)}
                onBlur={() => setPinFocused(false)}
              />
              <Pressable
                onPress={() => setPinVisible(v => !v)}
                hitSlop={8}
              >
                <EyeIcon visible={pinVisible} />
              </Pressable>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <Pressable
              style={styles.rememberRow}
              onPress={() => setRememberMe(v => !v)}
            >
              <View
                style={[
                  styles.checkbox,
                  rememberMe && styles.checkboxChecked,
                ]}
              >
                {rememberMe && <View style={styles.checkboxDot} />}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </Pressable>

            <Pressable onPress={onForgotPassword}>
              <Text style={styles.link}>Forgot Password?</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <Pressable
            style={[styles.truecallerButton, truecallerBusy && styles.truecallerBusy]}
            onPress={handleTruecaller}
            disabled={truecallerBusy}
          >
            <View style={styles.truecallerBadge}>
              <Text style={styles.truecallerBadgeText}>T</Text>
            </View>
            <Text style={styles.truecallerButtonText}>
              {truecallerBusy ? 'Opening Truecaller…' : 'Log In with Truecaller'}
            </Text>
          </Pressable>
          {truecallerError ? (
            <Text style={styles.truecallerError}>{truecallerError}</Text>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={onSignUp}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </Pressable>
        </View>

        <View style={styles.legalLinks}>
          <Pressable onPress={() => onNavigate?.('termsofuse')}>
            <Text style={styles.legalLink}>Terms of Use</Text>
          </Pressable>
          <Text style={styles.legalSeparator}>•</Text>
          <Pressable onPress={() => onNavigate?.('privacypolicy')}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  truecallerBusy: { opacity: 0.6 },
  truecallerError: { marginTop: 10, fontSize: 13, textAlign: 'center', color: '#B3261E' },
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  logo: {
    ...typography.logo,
    color: colors.primary,
  },
  main: {
    marginBottom: 32,
  },
  greeting: {
    ...typography.greeting,
    color: colors.heading,
  },
  welcome: {
    ...typography.welcome,
    color: colors.heading,
    marginBottom: 10,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    ...typography.label,
    color: colors.heading,
    marginBottom: 8,
  },
  input: {
    ...typography.input,
    color: colors.heading,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingRight: 14,
  },
  pinInput: {
    ...typography.input,
    color: colors.heading,
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  eyeIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeOuter: {
    width: 20,
    height: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeOuterOpen: {
    borderColor: colors.primary,
  },
  eyeOuterClosed: {
    height: 1.5,
    borderRadius: 1,
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  rememberText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  link: {
    ...typography.link,
    color: colors.primary,
  },
  actions: {
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  loginButtonText: {
    ...typography.button,
    color: colors.white,
  },
  truecallerButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  truecallerBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  truecallerBadgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  truecallerButtonText: {
    ...typography.button,
    color: colors.heading,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.link,
    color: colors.primary,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  legalLink: {
    fontSize: 12,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
    marginHorizontal: 6,
  },
  legalSeparator: {
    fontSize: 12,
    color: colors.border,
  },
});
