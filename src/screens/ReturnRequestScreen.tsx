import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import SubScreen from '../components/common/SubScreen';
import { useNotifications } from '../context/NotificationContext';
import { useOrders } from '../context/OrderContext';
import { orderItemKey } from '../types/order';
import type { ReturnKind } from '../types/order';
import { formatRupees } from '../utils/pricing';

type ReturnRequestScreenProps = {
  orderId: string;
  onBack: () => void;
  onCartPress: () => void;
  onDone: () => void;
  onOpenPolicy: () => void;
};

const REASONS = [
  'Size is too small',
  'Size is too big',
  'Colour looks different',
  'Quality is not as expected',
  'Received a damaged item',
  'Wrong item received',
];

export default function ReturnRequestScreen({
  orderId,
  onBack,
  onCartPress,
  onDone,
  onOpenPolicy,
}: ReturnRequestScreenProps) {
  const { orders, requestReturn } = useOrders();
  const { notify } = useNotifications();
  const order = orders.find(item => item.id === orderId);
  const [kind, setKind] = useState<ReturnKind>('Return');
  const [selected, setSelected] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [showError, setShowError] = useState(false);

  if (!order) {
    return (
      <SubScreen title="Return" onBack={onBack} onCartPress={onCartPress}>
        <Text style={styles.muted}>This order could not be found.</Text>
      </SubScreen>
    );
  }

  const toggle = (key: string) =>
    setSelected(current =>
      current.includes(key) ? current.filter(item => item !== key) : [...current, key],
    );

  const submit = () => {
    if (selected.length === 0 || !reason) {
      setShowError(true);
      return;
    }
    requestReturn(order.id, {
      kind,
      reason,
      note: note.trim(),
      itemKeys: selected,
      requestedAt: new Date().toISOString(),
    });
    notify(
      `${kind} requested`,
      `${order.id}: we will arrange a pickup within 2 days.`,
      order.id,
    );
    onDone();
  };

  const footer = (
    <Pressable style={styles.submit} onPress={submit}>
      <Text style={styles.submitText}>Submit {kind.toLowerCase()} request</Text>
    </Pressable>
  );

  return (
    <SubScreen title="Return or exchange" onBack={onBack} onCartPress={onCartPress} footer={footer}>
      <View style={styles.toggleRow}>
        {(['Return', 'Exchange'] as ReturnKind[]).map(option => (
          <Pressable
            key={option}
            style={[styles.toggle, kind === option && styles.toggleActive]}
            onPress={() => setKind(option)}
          >
            <Text style={[styles.toggleText, kind === option && styles.toggleTextActive]}>
              {option === 'Return' ? 'Return for refund' : 'Exchange size'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.heading}>Select items</Text>
      {order.items.map(item => {
        const key = orderItemKey(item);
        const active = selected.includes(key);
        return (
          <Pressable
            key={key}
            style={[styles.item, active && styles.itemActive]}
            onPress={() => toggle(key)}
          >
            <View style={[styles.check, active && styles.checkActive]}>
              {active && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <View style={styles.itemBody}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.sub}>
                Size {item.size} · Qty {item.quantity} · {formatRupees(item.unitPrice * item.quantity)}
              </Text>
            </View>
          </Pressable>
        );
      })}

      <Text style={styles.heading}>Reason</Text>
      <View style={styles.chips}>
        {REASONS.map(item => (
          <Pressable
            key={item}
            style={[styles.chip, reason === item && styles.chipActive]}
            onPress={() => setReason(item)}
          >
            <Text style={[styles.chipText, reason === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Anything else we should know? (optional)"
        placeholderTextColor={colors.placeholder}
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={300}
      />

      {showError && (
        <Text style={styles.error}>Select at least one item and a reason.</Text>
      )}

      <Pressable onPress={onOpenPolicy}>
        <Text style={styles.link}>Read the returns policy ›</Text>
      </Pressable>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  muted: { fontSize: 14, color: colors.textSecondary },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  toggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  toggleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { fontSize: 13, fontWeight: '700', color: colors.heading },
  toggleTextActive: { color: colors.white },
  heading: { marginTop: 14, marginBottom: 10, fontSize: 15, fontWeight: '700', color: colors.heading },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  itemActive: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.heading },
  sub: { marginTop: 3, fontSize: 12, color: colors.textSecondary },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  checkMark: { fontSize: 13, fontWeight: '800', color: colors.white },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.heading },
  chipTextActive: { color: colors.white, fontWeight: '700' },
  input: {
    minHeight: 80,
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 14,
    color: colors.heading,
    textAlignVertical: 'top',
  },
  error: { marginTop: 10, fontSize: 13, fontWeight: '600', color: '#B3261E' },
  link: { marginTop: 16, fontSize: 13, fontWeight: '700', color: colors.primary, textAlign: 'center' },
  submit: { paddingVertical: 15, borderRadius: 14, alignItems: 'center', backgroundColor: colors.primary },
  submitText: { fontSize: 15, fontWeight: '700', color: colors.white },
});
