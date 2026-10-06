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

type SignUpScreenProps = {
  onLogin?: () => void;
};

export default function SignUpScreen({ onLogin }: SignUpScreenProps) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinVisible, setPinVisible] = useState(false);
  const [confirmPinVisible, setConfirmPinVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'fullName' && styles.inputFocused,
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'phone' && styles.inputFocused,
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.placeholder}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'email' && styles.inputFocused,
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PIN</Text>
            <View
              style={[
                styles.input,
                styles.pinRow,
                focusedField === 'pin' && styles.inputFocused,
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
                onFocus={() => setFocusedField('pin')}
                onBlur={() => setFocusedField(null)}
              />
              <Pressable onPress={() => setPinVisible(v => !v)} hitSlop={8}>
                <EyeIcon visible={pinVisible} />
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm PIN</Text>
            <View
              style={[
                styles.input,
                styles.pinRow,
                focusedField === 'confirmPin' && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.pinInput}
                placeholder="Re-enter your PIN"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                secureTextEntry={!confirmPinVisible}
                value={confirmPin}
                onChangeText={setConfirmPin}
                onFocus={() => setFocusedField('confirmPin')}
                onBlur={() => setFocusedField(null)}
              />
              <Pressable onPress={() => setConfirmPinVisible(v => !v)} hitSlop={8}>
                <EyeIcon visible={confirmPinVisible} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={onLogin}>
            <Text style={styles.footerLink}>Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 28,
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
  actions: {
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.white,
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
});
