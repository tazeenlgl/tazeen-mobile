import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import SubScreen from '../components/common/SubScreen';
import ProductImagePlaceholder from '../components/products/ProductImagePlaceholder';
import { useOrders } from '../context/OrderContext';
import { ORDER_STEPS } from '../types/order';
import type { Order, OrderStatus } from '../types/order';

type OrdersScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
  onBrowseProducts: () => void;
  onOpenOrder: (orderId: string) => void;
};

type FilterKey = 'all' | 'active' | 'delivered' | 'cancelled';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const statusStyle: Record<OrderStatus, { bg: string; fg: string }> = {
  Placed: { bg: colors.softAmber, fg: colors.amber },
  Packed: { bg: colors.primaryTint, fg: colors.primary },
  Shipped: { bg: colors.primaryTint, fg: colors.primary },
  'Out for delivery': { bg: colors.primaryTint, fg: colors.primary },
  Delivered: { bg: colors.softGreen, fg: colors.deepGreen },
  Cancelled: { bg: '#FBE9E7', fg: '#B3261E' },
};

const formatRupees = (value: number): string => `₹${value.toLocaleString('en-IN')}`;

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const matchesFilter = (order: Order, filter: FilterKey): boolean => {
  if (filter === 'all') return true;
  if (filter === 'delivered') return order.status === 'Delivered';
  if (filter === 'cancelled') return order.status === 'Cancelled';
  return order.status !== 'Delivered' && order.status !== 'Cancelled';
};

function Timeline({ status }: { status: OrderStatus }) {
  const reached = ORDER_STEPS.indexOf(status as (typeof ORDER_STEPS)[number]);
  return (
    <View style={styles.timeline}>
      {ORDER_STEPS.map((step, index) => {
        const done = index <= reached;
        return (
          <View key={step} style={styles.timelineStep}>
            <View style={[styles.dot, done && styles.dotDone]} />
            <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{step}</Text>
          </View>
        );
      })}
    </View>
  );
}

function OrderCard({ order, onOpen }: { order: Order; onOpen: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const tone = statusStyle[order.status];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const visibleThumbs = order.items.slice(0, 3);

  return (
    <Pressable
      style={styles.card}
      onPress={() => setOpen(current => !current)}
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.id}, ${order.status}`}
    >
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.date}>{formatDate(order.placedAt)}</Text>
        </View>
        <Text style={[styles.status, { backgroundColor: tone.bg, color: tone.fg }]}>
          {order.status}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.thumbs}>
          {visibleThumbs.map(item => (
            <ProductImagePlaceholder
              key={`${item.productId}-${item.size}`}
              tint={item.imageTint}
              compact
              style={styles.thumb}
            />
          ))}
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {order.items[0].title}
            {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
          </Text>
          <Text style={styles.meta}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · {formatRupees(order.total)}
          </Text>
        </View>
        <Text style={styles.chevron}>{open ? '⌃' : '⌄'}</Text>
      </View>

      {open && (
        <View style={styles.details}>
          {order.status !== 'Cancelled' && <Timeline status={order.status} />}

          {order.items.map(item => (
            <View key={`${item.productId}-${item.size}`} style={styles.line}>
              <Text style={styles.lineTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.lineMeta}>
                Size {item.size} · Qty {item.quantity}
              </Text>
              <Text style={styles.linePrice}>
                {formatRupees(item.unitPrice * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatRupees(order.subtotal)}</Text>
            </View>
            {order.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={[styles.totalValue, styles.discount]}>
                  −{formatRupees(order.discount)}
                </Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery</Text>
              <Text style={styles.totalValue}>
                {order.deliveryFee === 0 ? 'Free' : formatRupees(order.deliveryFee)}
              </Text>
            </View>
            <View style={[styles.totalRow, styles.grandRow]}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={styles.grandValue}>{formatRupees(order.total)}</Text>
            </View>
          </View>

          <Text style={styles.infoLabel}>Delivered to · {order.addressLabel}</Text>
          <Text style={styles.infoValue}>{order.addressSummary}</Text>
          <Text style={styles.infoLabel}>Payment</Text>
          <Text style={styles.infoValue}>{order.paymentMethod}</Text>
          {order.returnRequest && (
            <Text style={styles.returnTag}>{order.returnRequest.kind} requested</Text>
          )}
          <Pressable style={styles.trackButton} onPress={() => onOpen(order.id)}>
            <Text style={styles.trackText}>
              {order.status === 'Delivered' ? 'View details or return' : 'Track order'}
            </Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

export default function OrdersScreen({
  onBack,
  onCartPress,
  onBrowseProducts,
  onOpenOrder,
}: OrdersScreenProps) {
  const { orders } = useOrders();
  const [filter, setFilter] = useState<FilterKey>('all');

  const visible = useMemo(
    () => orders.filter(order => matchesFilter(order, filter)),
    [orders, filter],
  );

  return (
    <SubScreen title="My orders" onBack={onBack} onCartPress={onCartPress}>
      <View style={styles.filters}>
        {FILTERS.map(item => {
          const active = item.key === filter;
          return (
            <Pressable
              key={item.key}
              style={[styles.filter, active && styles.filterActive]}
              onPress={() => setFilter(item.key)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {visible.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No orders here yet</Text>
          <Text style={styles.emptyBody}>Your orders will show up in this list.</Text>
          <Pressable style={styles.emptyButton} onPress={onBrowseProducts}>
            <Text style={styles.emptyButtonText}>Browse products</Text>
          </Pressable>
        </View>
      ) : (
        visible.map(order => <OrderCard key={order.id} order={order} onOpen={onOpenOrder} />)
      )}
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.heading },
  filterTextActive: { color: colors.white },
  card: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontFamily: displayFont, fontSize: 16, fontWeight: '700', color: colors.heading },
  date: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  status: {
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 12 },
  thumbs: { flexDirection: 'row' },
  thumb: { width: 44, height: 52, borderRadius: 10, marginRight: -10, borderWidth: 2, borderColor: colors.surface },
  summaryText: { flex: 1, marginLeft: 10 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.heading },
  meta: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  chevron: { fontSize: 18, color: colors.textSecondary },
  details: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  timeline: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  timelineStep: { alignItems: 'center', flex: 1 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.border, marginBottom: 6 },
  dotDone: { backgroundColor: colors.primary },
  stepLabel: { fontSize: 11, color: colors.textSecondary },
  stepLabelDone: { color: colors.primary, fontWeight: '700' },
  line: { marginBottom: 12 },
  lineTitle: { fontSize: 14, fontWeight: '600', color: colors.heading },
  lineMeta: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  linePrice: { marginTop: 2, fontSize: 13, fontWeight: '700', color: colors.heading },
  totals: { marginTop: 4, marginBottom: 12, padding: 12, borderRadius: 12, backgroundColor: colors.background },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  totalLabel: { fontSize: 13, color: colors.textSecondary },
  totalValue: { fontSize: 13, fontWeight: '600', color: colors.heading },
  discount: { color: colors.deepGreen },
  grandRow: { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  grandLabel: { fontSize: 14, fontWeight: '700', color: colors.heading },
  grandValue: { fontSize: 15, fontWeight: '800', color: colors.heading },
  infoLabel: { marginTop: 6, fontSize: 12, color: colors.textSecondary },
  infoValue: { marginTop: 2, fontSize: 13, color: colors.heading },
  returnTag: { marginTop: 8, fontSize: 12, fontWeight: '700', color: colors.amber },
  trackButton: { marginTop: 14, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: colors.primaryTint },
  trackText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.heading },
  emptyBody: { marginTop: 6, fontSize: 14, color: colors.textSecondary },
  emptyButton: { marginTop: 18, paddingHorizontal: 22, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.primary },
  emptyButtonText: { fontSize: 14, fontWeight: '700', color: colors.white },
});
