import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import SubScreen from '../components/common/SubScreen';
import { useAddresses } from '../context/AddressContext';
import type { Address } from '../types/address';

type AddressesScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
  onAdd: () => void;
  onEdit: (address: Address) => void;
};

const formatAddress = (address: Address): string =>
  [
    address.line1,
    address.line2,
    `${address.district}, ${address.state} ${address.pincode}`,
  ]
    .filter(Boolean)
    .join(', ');

export default function AddressesScreen({
  onBack,
  onCartPress,
  onAdd,
  onEdit,
}: AddressesScreenProps) {
  const { addresses, removeAddress, setDefaultAddress } = useAddresses();

  const confirmRemove = (address: Address) => {
    Alert.alert('Delete address', `Remove your ${address.label} address?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeAddress(address.id),
      },
    ]);
  };

  return (
    <SubScreen
      title="My addresses"
      onBack={onBack}
      onCartPress={onCartPress}
      footer={
        <Pressable style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>+ Add new address</Text>
        </Pressable>
      }
    >
      {addresses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No saved addresses</Text>
          <Text style={styles.emptyBody}>
            Add a delivery address to check out faster.
          </Text>
        </View>
      ) : (
        addresses.map(address => (
          <View
            key={address.id}
            style={[styles.card, address.isDefault && styles.cardDefault]}
          >
            <View style={styles.cardTop}>
              <View style={styles.badges}>
                <Text style={styles.chip}>{address.label}</Text>
                {address.isDefault && <Text style={styles.defaultTag}>Default</Text>}
              </View>
            </View>
            <Text style={styles.name}>{address.fullName}</Text>
            <Text style={styles.body}>{formatAddress(address)}</Text>
            <Text style={styles.phone}>+91 {address.phone}</Text>

            <View style={styles.actions}>
              <Pressable onPress={() => onEdit(address)} hitSlop={8}>
                <Text style={styles.action}>Edit</Text>
              </Pressable>
              {!address.isDefault && (
                <Pressable onPress={() => setDefaultAddress(address.id)} hitSlop={8}>
                  <Text style={styles.action}>Make default</Text>
                </Pressable>
              )}
              <Pressable onPress={() => confirmRemove(address)} hitSlop={8}>
                <Text style={[styles.action, styles.delete]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardDefault: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.primaryTint,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  defaultTag: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  phone: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  action: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  delete: {
    color: '#B3261E',
  },
  addButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.heading,
  },
  emptyBody: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
