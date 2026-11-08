import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';
import { estimatedDelivery } from '../../utils/pricing';

const PIN_CODE_PATTERN = /^[1-9][0-9]{5}$/;

// Mock-only check for Stage 2. Replace this function's body with a real
// delivery-availability API call once the backend is connected — the
// component's props/behavior do not need to change.
function checkDeliveryMock(pinCode: string): string {
  if (!PIN_CODE_PATTERN.test(pinCode)) {
    return 'Enter a valid 6-digit PIN code';
  }
  // Metro PIN codes (1 to 7 prefix) are quicker than the rest in this mock.
  const days = /^[1-7]/.test(pinCode) ? 4 : 6;
  return `Delivery by ${estimatedDelivery(new Date().toISOString(), days)} · Cash on delivery available`;
}

export default function DeliveryChecker() {
  const [pinCode, setPinCode] = useState('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleCheck = () => {
    setResultMessage(checkDeliveryMock(pinCode));
  };

  const isResultValid =
    resultMessage !== null && PIN_CODE_PATTERN.test(pinCode);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Check Delivery</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter PIN Code"
          placeholderTextColor={colors.placeholder}
          keyboardType="number-pad"
          maxLength={6}
          value={pinCode}
          onChangeText={text => {
            setPinCode(text.replace(/[^0-9]/g, ''));
            setResultMessage(null);
          }}
        />
        <Pressable style={styles.checkButton} onPress={handleCheck}>
          <Text style={styles.checkButtonText}>Check</Text>
        </Pressable>
      </View>
      {resultMessage && (
        <Text
          style={[
            styles.resultText,
            isResultValid ? styles.resultValid : styles.resultInvalid,
          ]}
        >
          {resultMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.heading,
    marginRight: 10,
  },
  checkButton: {
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  checkButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  resultText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  resultValid: {
    color: colors.deepGreen,
  },
  resultInvalid: {
    color: colors.primaryDark,
  },
});
