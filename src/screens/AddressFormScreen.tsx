import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import SubScreen from '../components/common/SubScreen';
import FormField from '../components/common/FormField';
import { useAddresses } from '../context/AddressContext';
import { useAuth } from '../context/AuthContext';
import type { Address, AddressLabel } from '../types/address';

type AddressFormScreenProps = {
  // When provided the form edits this address, otherwise it creates one.
  address?: Address;
  onBack: () => void;
  onCartPress: () => void;
  onSaved: () => void;
};

const LABELS: AddressLabel[] = ['Home', 'Work', 'Other'];

type FormErrors = Partial<Record<'fullName' | 'phone' | 'line1' | 'pincode' | 'district' | 'state', string>>;

export default function AddressFormScreen({
  address,
  onBack,
  onCartPress,
  onSaved,
}: AddressFormScreenProps) {
  const { user } = useAuth();
  const { addresses, addAddress, updateAddress } = useAddresses();
  const [label, setLabel] = useState<AddressLabel>(address?.label ?? 'Home');
  const [fullName, setFullName] = useState(address?.fullName ?? '');
  const [phone, setPhone] = useState(address?.phone ?? user?.phone ?? '');
  const [line1, setLine1] = useState(address?.line1 ?? '');
  const [line2, setLine2] = useState(address?.line2 ?? '');
  const [pincode, setPincode] = useState(address?.pincode ?? '');
  const [district, setDistrict] = useState(address?.district ?? '');
  const [state, setState] = useState(address?.state ?? '');
  const [isDefault, setIsDefault] = useState(
    address?.isDefault ?? addresses.length === 0,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!fullName.trim()) next.fullName = 'Enter the recipient name';
    if (!/^\d{10}$/.test(phone)) next.phone = 'Enter a 10-digit phone number';
    if (!line1.trim()) next.line1 = 'Enter house number and street';
    if (!/^\d{6}$/.test(pincode)) next.pincode = 'Enter a 6-digit PIN code';
    if (!district.trim()) next.district = 'Enter the district';
    if (!state.trim()) next.state = 'Enter the state';
    return next;
  };

  const handleSave = () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }
    const input = {
      label,
      fullName: fullName.trim(),
      phone,
      line1: line1.trim(),
      line2: line2.trim(),
      pincode,
      district: district.trim(),
      state: state.trim(),
      isDefault,
    };
    if (address) {
      updateAddress(address.id, input);
    } else {
      addAddress(input);
    }
    onSaved();
  };

  return (
    <SubScreen
      title={address ? 'Edit address' : 'New address'}
      onBack={onBack}
      onCartPress={onCartPress}
      footer={
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save address</Text>
        </Pressable>
      }
    >
      <Text style={styles.groupLabel}>Save as</Text>
      <View style={styles.chipRow}>
        {LABELS.map(item => {
          const active = item === label;
          return (
            <Pressable
              key={item}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setLabel(item)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FormField
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
        placeholder="Recipient name"
      />
      <FormField
        label="Phone number"
        value={phone}
        onChangeText={text => setPhone(text.replace(/\D/g, '').slice(0, 10))}
        error={errors.phone}
        keyboardType="number-pad"
        placeholder="10-digit mobile number"
      />
      <FormField
        label="Address line 1"
        value={line1}
        onChangeText={setLine1}
        error={errors.line1}
        placeholder="House no., street"
      />
      <FormField
        label="Address line 2 (optional)"
        value={line2}
        onChangeText={setLine2}
        placeholder="Landmark, area"
      />
      <FormField
        label="PIN code"
        value={pincode}
        onChangeText={text => setPincode(text.replace(/\D/g, '').slice(0, 6))}
        error={errors.pincode}
        keyboardType="number-pad"
        placeholder="6-digit PIN code"
      />
      <FormField
        label="District"
        value={district}
        onChangeText={setDistrict}
        error={errors.district}
        placeholder="District"
      />
      <FormField
        label="State"
        value={state}
        onChangeText={setState}
        error={errors.state}
        placeholder="State"
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Make this my default address</Text>
        <Switch
          value={isDefault}
          onValueChange={setIsDefault}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor={colors.white}
        />
      </View>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.heading,
  },
  chipTextActive: {
    color: colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.heading,
  },
  saveButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
