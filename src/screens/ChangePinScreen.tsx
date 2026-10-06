import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';
import { useAuth } from '../context/AuthContext';

type ChangePinScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
};

export default function ChangePinScreen({
  onBack,
  onCartPress,
}: ChangePinScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showMessage, setShowMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validatePin = (pin: string): boolean => {
    return /^\d{6,}$/.test(pin);
  };

  const validate = (): string | null => {
    if (!currentPin) return 'Current PIN is required';
    if (!newPin) return 'New PIN is required';
    if (!confirmPin) return 'Confirm PIN is required';

    if (!validatePin(currentPin)) return 'Current PIN must be at least 6 digits';
    if (!validatePin(newPin)) return 'New PIN must be at least 6 digits';

    if (newPin === currentPin) return 'New PIN must be different from current PIN';
    if (newPin !== confirmPin) return 'New PIN and confirm PIN do not match';

    return null;
  };

  const handleChangePin = () => {
    const error = validate();
    if (error) {
      setShowMessage({ type: 'error', text: error });
      return;
    }

    // Verify current PIN matches stored PIN
    if (currentPin !== user?.pin) {
      setShowMessage({ type: 'error', text: 'Current PIN is incorrect' });
      return;
    }

    // Backend integration would happen here
    // For now, just show success message
    setShowMessage({
      type: 'success',
      text: 'PIN changed successfully',
    });

    // Reset form
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');

    // Navigate back after brief delay
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const isFormValid = currentPin && newPin && confirmPin && !validate();

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <TopBar title="Change PIN" onBack={onBack} onCartPress={onCartPress} />

      <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.description}>
          Enter your current PIN and a new 6+ digit PIN to update your account security.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Current PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter current PIN"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            keyboardType="numeric"
            maxLength={12}
            value={currentPin}
            onChangeText={setCurrentPin}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>New PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new PIN (6+ digits)"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            keyboardType="numeric"
            maxLength={12}
            value={newPin}
            onChangeText={setNewPin}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Confirm New PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm new PIN"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            keyboardType="numeric"
            maxLength={12}
            value={confirmPin}
            onChangeText={setConfirmPin}
          />
        </View>

        {showMessage && (
          <View
            style={[
              styles.message,
              showMessage.type === 'error' ? styles.errorMessage : styles.successMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                showMessage.type === 'error' ? styles.errorText : styles.successText,
              ]}
            >
              {showMessage.text}
            </Text>
          </View>
        )}

        <Pressable
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleChangePin}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Change PIN</Text>
        </Pressable>
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
    paddingTop: 16,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 24,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.heading,
  },
  message: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorMessage: {
    backgroundColor: 'rgba(211, 0, 0, 0.1)',
  },
  successMessage: {
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
  },
  messageText: {
    fontSize: 13,
  },
  errorText: {
    color: '#AA0000',
  },
  successText: {
    color: '#228B22',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
