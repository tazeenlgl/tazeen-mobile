import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import SubScreen from '../components/common/SubScreen';
import { useNotifications } from '../context/NotificationContext';
import { useOrders } from '../context/OrderContext';
import { ORDER_STEPS } from '../types/order';
import {
  estimatedDelivery,
  formatDate,
  formatDateTime,
  formatRupees,
  RETURN_WINDOW_DAYS,
} from '../utils/pricing';

type OrderDetailsScreenProps = {
  orderId: string;
  onBack: () => void;
  onCartPress: () => void;
  onReturn: () => void;
  onOpenPolicy: () => void;
};

const STEP_NOTES: Record<string, string> = {
  Placed: 'We have received your order.',
  Packed: 'Your items are packed and ready.',
  Shipped: 'Handed to the courier.',
  'Out for delivery': 'Arriving today.',
  Delivered: 'Delivered to you.',
};

const ALERTS: Record<string, string> = {
  Packed: 'Your order is packed and will ship soon.',
  Shipped: 'Your order has shipped.',
  'Out for delivery': 'Your order is out for delivery today.',
  Delivered: 'Your order was delivered. Enjoy!',
};

export default function OrderDetailsScreen({
  orderId,
  onBack,
  onCartPress,
  onReturn,
  onOpenPolicy,
}: OrderDetailsScreenProps) {
  const { orders, advanceOrder, cancelOrder } = useOrders();
  const { notify } = useNotifications();
  const order = orders.find(item => item.id === orderId);

  if (!order) {
    return (
      <SubScreen title="Order" onBack={onBack} onCartPress={onCartPress}>
        <Text style={styles.muted}>This order could not be found.</Text>
      </SubScreen>
    );
  }

  const reached = ORDER_STEPS.indexOf(order.status as (typeof ORDER_STEPS)[number]);
  const cancelled = order.status === 'Cancelled';
  const delivered = order.status === 'Delivered';
  const canCancel = order.status === 'Placed' || order.status === 'Packed';
  const deliveredAt = order.history?.Delivered;
  const returnOpen =
    delivered &&
    !order.returnRequest &&
    (!deliveredAt ||
      Date.now() - new Date(deliveredAt).getTime() < RETURN_WINDOW_DAYS * 86400000);

  const advance = () => {
    const next = advanceOrder(order.id);
    if (next) {
      notify(`Order ${next.toLowerCase()}`, `${order.id}: ${ALERTS[next]}`, order.id);
    }
  };

  const cancel = () => {
    cancelOrder(order.id);
    notify('Order cancelled', `${order.id} was cancelled. Any payment will be refunded.`, order.id);
  };

  return (
    <SubScreen title={order.id} onBack={onBack} onCartPress={onCartPress}>
      <View style={styles.card}>
        <Text style={styles.status}>{order.status}</Text>
        <Text style={styles.sub}>Placed {formatDate(order.placedAt)}</Text>
        {!cancelled && !delivered && (
          <Text style={styles.eta}>Arriving by {estimatedDelivery(order.placedAt)}</Text>
        )}
      </View>

      {order.returnRequest && (
        <View style={[styles.card, styles.returnCard]}>
          <Text style={styles.returnTitle}>
            {order.returnRequest.kind} requested · {formatDate(order.returnRequest.requestedAt)}
          </Text>
          <Text style={styles.sub}>Reason: {order.returnRequest.reason}</Text>
          <Text style={styles.sub}>We will contact you to arrange the pickup.</Text>
        </View>
      )}

      {!cancelled && (
        <View style={styles.card}>
          <Text style={styles.heading}>Tracking</Text>
          {ORDER_STEPS.map((step, index) => {
            const done = index <= reached;
            const at = order.history?.[step];
            return (
              <View key={step} style={styles.stepRow}>
                <View style={styles.rail}>
                  <View style={[styles.dot, done && styles.dotDone]} />
                  {index < ORDER_STEPS.length - 1 && (
                    <View style={[styles.line, index < reached && styles.lineDone]} />
                  )}
                </View>
                <View style={styles.stepBody}>
                  <Text style={[styles.stepTitle, done && styles.stepTitleDone]}>{step}</Text>
                  <Text style={styles.stepNote}>
                    {done && at ? formatDateTime(at) : STEP_NOTES[step]}
                  </Text>
                </View>
              </View>
            );
          })}
          {!delivered && (
            <Pressable style={styles.demoButton} onPress={advance}>
              <Text style={styles.demoText}>Demo: simulate next courier update</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.heading}>Items</Text>
        {order.items.map(item => (
          <View key={`${item.productId}-${item.size}`} style={styles.itemRow}>
            <View style={styles.itemBody}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.sub}>
                Size {item.size} · Qty {item.quantity}
              </Text>
            </View>
            <Text style={styles.itemPrice}>{formatRupees(item.unitPrice * item.quantity)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <Line label="Subtotal" value={formatRupees(order.subtotal)} />
        {order.discount > 0 && <Line label="Discount" value={`−${formatRupees(order.discount)}`} accent />}
        <Line label="Delivery" value={order.deliveryFee === 0 ? 'Free' : formatRupees(order.deliveryFee)} />
        <Line label="Total" value={formatRupees(order.total)} bold />
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Delivery and payment</Text>
        <Text style={styles.itemTitle}>{order.addressLabel}</Text>
        <Text style={styles.sub}>{order.addressSummary}</Text>
        <Text style={[styles.itemTitle, styles.gap]}>Payment</Text>
        <Text style={styles.sub}>{order.paymentMethod}</Text>
      </View>

      {canCancel && (
        <Pressable style={styles.dangerButton} onPress={cancel}>
          <Text style={styles.dangerText}>Cancel order</Text>
        </Pressable>
      )}
      {returnOpen && (
        <Pressable style={styles.primaryButton} onPress={onReturn}>
          <Text style={styles.primaryText}>Return or exchange items</Text>
        </Pressable>
      )}
      <Pressable onPress={onOpenPolicy}>
        <Text style={styles.link}>Returns and exchange policy ›</Text>
      </Pressable>
    </SubScreen>
  );
}

function Line({ label, value, accent, bold }: { label: string; value: string; accent?: boolean; bold?: boolean }) {
  return (
    <View style={styles.lineRow}>
      <Text style={[styles.sub, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.lineValue, accent && styles.accent, bold && styles.bold]}>{value}</Text>
    </View>
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
  returnCard: { backgroundColor: colors.softAmber },
  returnTitle: { fontSize: 14, fontWeight: '700', color: colors.amber },
  status: { fontFamily: displayFont, fontSize: 24, fontWeight: '700', color: colors.heading },
  sub: { marginTop: 3, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  eta: { marginTop: 8, fontSize: 14, fontWeight: '700', color: colors.primary },
  heading: { marginBottom: 12, fontSize: 15, fontWeight: '700', color: colors.heading },
  muted: { fontSize: 14, color: colors.textSecondary },
  stepRow: { flexDirection: 'row', minHeight: 52 },
  rail: { width: 22, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.border },
  dotDone: { backgroundColor: colors.primary },
  line: { flex: 1, width: 2, backgroundColor: colors.border },
  lineDone: { backgroundColor: colors.primary },
  stepBody: { flex: 1, paddingLeft: 10, paddingBottom: 14 },
  stepTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  stepTitleDone: { fontWeight: '800', color: colors.heading },
  stepNote: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  demoButton: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
  },
  demoText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.heading },
  itemPrice: { fontSize: 14, fontWeight: '700', color: colors.heading },
  gap: { marginTop: 12 },
  divider: { height: 1, marginVertical: 8, backgroundColor: colors.border },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  lineValue: { fontSize: 13, fontWeight: '600', color: colors.heading },
  accent: { color: colors.deepGreen },
  bold: { fontSize: 15, fontWeight: '800', color: colors.heading },
  primaryButton: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: colors.primary },
  primaryText: { fontSize: 15, fontWeight: '700', color: colors.white },
  dangerButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B3261E',
  },
  dangerText: { fontSize: 15, fontWeight: '700', color: '#B3261E' },
  link: { marginTop: 14, marginBottom: 8, fontSize: 13, fontWeight: '700', color: colors.primary, textAlign: 'center' },
});
