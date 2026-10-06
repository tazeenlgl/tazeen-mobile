import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type CartSummaryProps = {
  subtotal: number;
  totalDiscount: number;
  total: number;
  onCheckout?: () => void;
};

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function CartSummary({
  subtotal,
  totalDiscount,
  total,
  onCheckout,
}: CartSummaryProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatRupees(subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Discount</Text>
        <Text style={styles.discountValue}>
          {'−'}
          {formatRupees(totalDiscount)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatRupees(total)}</Text>
      </View>

      <Pressable style={styles.checkoutButton} onPress={onCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
  },
  discountValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.deepGreen,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.heading,
  },
  checkoutButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
