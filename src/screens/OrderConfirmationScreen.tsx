import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import type { Order } from '../types/order';
import { estimatedDelivery, formatRupees } from '../utils/pricing';

type OrderConfirmationScreenProps = {
  order: Order;
  onTrack: () => void;
  onContinue: () => void;
};

export default function OrderConfirmationScreen({
  order,
  onTrack,
  onContinue,
}: OrderConfirmationScreenProps) {
  const insets = useSafeAreaInsets();
  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.flex, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.center}>
        <View style={styles.badge}>
          <Text style={styles.tick}>✓</Text>
        </View>
        <Text style={styles.title}>Order placed</Text>
        <Text style={styles.subtitle}>Thank you! We are getting your order ready.</Text>

        <View style={styles.card}>
          <Row label="Order number" value={order.id} />
          <Row label="Items" value={`${units}`} />
          <Row label="Total paid" value={formatRupees(order.total)} />
          <Row label="Payment" value={order.paymentMethod} />
          <Row label="Arriving by" value={estimatedDelivery(order.placedAt)} />
          <Row label="Delivering to" value={order.addressLabel} last />
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primary} onPress={onTrack}>
          <Text style={styles.primaryText}>Track order</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={onContinue}>
          <Text style={styles.secondaryText}>Continue shopping</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', width: '100%', maxWidth: 520, alignSelf: 'center' },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  tick: { fontSize: 40, fontWeight: '800', color: colors.white },
  title: { marginTop: 20, fontFamily: displayFont, fontSize: 28, fontWeight: '700', color: colors.heading },
  subtitle: { marginTop: 6, fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  card: {
    alignSelf: 'stretch',
    marginTop: 28,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  label: { fontSize: 13, color: colors.textSecondary },
  value: { fontSize: 14, fontWeight: '700', color: colors.heading },
  actions: { width: '100%', maxWidth: 520, alignSelf: 'center', gap: 10 },
  primary: { paddingVertical: 15, borderRadius: 14, alignItems: 'center', backgroundColor: colors.primary },
  primaryText: { fontSize: 15, fontWeight: '700', color: colors.white },
  secondary: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryText: { fontSize: 15, fontWeight: '700', color: colors.primary },
});
