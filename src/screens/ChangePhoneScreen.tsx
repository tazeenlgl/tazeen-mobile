import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import SubScreen from '../components/common/SubScreen';
import FormField from '../components/common/FormField';
import { useAuth } from '../context/AuthContext';

type ChangePhoneScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
  onDone: () => void;
};

// UI-only until a backend exists: the OTP is a fixed demo code.
const DEMO_OTP = '123456';

export default function ChangePhoneScreen({
  onBack,
  onCartPress,
  onDone,
}: ChangePhoneScreenProps) {
  const { user, updatePhone } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [newPhone, setNewPhone] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentPhone = user?.phone ?? '';

  const sendOtp = () => {
    if (!/^\d{10}$/.test(newPhone)) {
      setError('Enter a 10-digit phone number');
      return;
    }
    if (newPhone === currentPhone) {
      setError('This is already your number');
      return;
    }
    if (pin !== user?.pin) {
      setError('PIN is incorrect');
      return;
    }
    setError(null);
    setStep(2);
  };

  const verify = () => {
    if (otp !== DEMO_OTP) {
      setError('That code is not right. Try again');
      return;
    }
    updatePhone(newPhone);
    onDone();
  };

  return (
    <SubScreen
      title="Change number"
      onBack={step === 2 ? () => { setStep(1); setError(null); } : onBack}
      onCartPress={onCartPress}
      footer={
        <Pressable
          style={styles.button}
          onPress={step === 1 ? sendOtp : verify}
        >
          <Text style={styles.buttonText}>
            {step === 1 ? 'Send OTP' : 'Verify and update'}
          </Text>
        </Pressable>
      }
    >
      <View style={styles.steps}>
        <Text style={[styles.step, styles.stepActive]}>1  New number</Text>
        <Text style={styles.stepDash}>—</Text>
        <Text style={[styles.step, step === 2 && styles.stepActive]}>
          2  Verify OTP
        </Text>
      </View>

      <View style={styles.currentCard}>
        <Text style={styles.currentLabel}>Current number</Text>
        <Text style={styles.currentValue}>+91 {currentPhone || '—'}</Text>
      </View>

      {step === 1 ? (
        <>
          <FormField
            label="New phone number"
            value={newPhone}
            onChangeText={text => setNewPhone(text.replace(/\D/g, '').slice(0, 10))}
            keyboardType="number-pad"
            placeholder="10-digit mobile number"
          />
          <FormField
            label="Confirm with your PIN"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="number-pad"
            placeholder="Enter your PIN"
          />
          <Text style={styles.help}>
            We will send a 6-digit code to the new number. Your login number
            only changes after you verify it.
          </Text>
        </>
      ) : (
        <>
          <FormField
            label={`Code sent to +91 ${newPhone}`}
            value={otp}
            onChangeText={text => setOtp(text.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            placeholder="6-digit code"
            maxLength={6}
          />
          <Text style={styles.help}>Demo code: {DEMO_OTP}</Text>
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  step: {
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.border,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stepActive: {
    backgroundColor: colors.primaryTint,
    color: colors.primary,
  },
  stepDash: {
    color: colors.textSecondary,
  },
  currentCard: {
    padding: 14,
    marginBottom: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  currentLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  currentValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.heading,
  },
  help: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  error: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: '600',
    color: '#B3261E',
  },
  button: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
