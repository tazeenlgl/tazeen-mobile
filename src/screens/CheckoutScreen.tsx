import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import SubScreen from '../components/common/SubScreen';
import { applyCoupon, coupons as availableCoupons } from '../data/coupons';
import type { Coupon } from '../data/coupons';
import { isPaytmConfigured } from '../config/payment';
import { payWithPaytm } from '../services/payment/paytm';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../context/AddressContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useOrders } from '../context/OrderContext';
import type { Order } from '../types/order';
import {
  deliveryFeeFor,
  estimatedDelivery,
  FREE_DELIVERY_ABOVE,
  formatRupees,
  newOrderId,
} from '../utils/pricing';

type CheckoutScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
  onManageAddresses: () => void;
  onPlaced: (order: Order) => void;
};

const PAYMENT_METHODS = [
  { key: 'Paytm', title: 'Pay online', note: 'UPI, cards, wallets and net banking via Paytm' },
  { key: 'Cash on delivery', title: 'Cash on delivery', note: 'Pay when it arrives' },
];

// Mock payment: nothing is charged. `placeOrder` is the one place to swap in
// a real gateway (create order -> pay -> confirm) later.
export default function CheckoutScreen({
  onBack,
  onCartPress,
  onManageAddresses,
  onPlaced,
}: CheckoutScreenProps) {
  const { addresses } = useAddresses();
  const { items, subtotal, totalDiscount, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { notify } = useNotifications();
  const defaultId = addresses.find(item => item.isDefault)?.id ?? addresses[0]?.id;
  const [addressId, setAddressId] = useState<string | undefined>(defaultId);
  const [payment, setPayment] = useState('Paytm');
  const [payError, setPayError] = useState('');
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [coupon, setCoupon] = useState<{ coupon: Coupon; amountOff: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const address = addresses.find(item => item.id === addressId) ?? addresses[0];
  const couponOff = coupon?.amountOff ?? 0;
  const afterCoupon = total - couponOff;
  const deliveryFee = coupon?.coupon.freeDelivery ? 0 : deliveryFeeFor(afterCoupon);
  const payable = afterCoupon + deliveryFee;
  const canPay = Boolean(address) && items.length > 0 && !paying;

  const submitCode = (code: string) => {
    const result = applyCoupon(code, total);
    if (result.ok) {
      setCoupon({ coupon: result.coupon, amountOff: result.amountOff });
      setCouponError('');
      setCodeInput(result.coupon.code);
    } else {
      setCoupon(null);
      setCouponError(result.message);
    }
  };

  const placeOrder = async () => {
    if (!address || !canPay) {
      return;
    }
    setPaying(true);
    setPayError('');
    const orderId = newOrderId();

    let paymentRef: string | undefined;
    if (payment === 'Paytm') {
      const result = await payWithPaytm({
        orderId,
        amount: payable,
        customerId: user?.phone ?? address.phone,
        phone: address.phone,
      });
      if (!result.ok) {
        setPaying(false);
        setPayError(result.message);
        return;
      }
      paymentRef = result.transactionId;
    }

    const placedAt = new Date().toISOString();
    const order: Order = {
      id: orderId,
      placedAt,
      status: 'Placed',
      items: items.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        imageTint: item.product.imageTint,
      })),
      subtotal,
      discount: totalDiscount + couponOff,
      deliveryFee,
      total: payable,
      paymentMethod: payment,
      paymentRef,
      addressLabel: address.label,
      addressSummary: `${address.line1}, ${address.district} ${address.pincode}`,
      history: { Placed: placedAt },
    };
    addOrder(order);
    clearCart();
    notify(
      'Order placed',
      `${order.id} is confirmed. Arriving by ${estimatedDelivery(placedAt)}.`,
      order.id,
    );
    setPaying(false);
    onPlaced(order);
  };

  const footer = (
    <Pressable
      style={[styles.payButton, !canPay && styles.payDisabled]}
      onPress={placeOrder}
      disabled={!canPay}
    >
      <Text style={styles.payText}>
        {paying
          ? 'Processing payment…'
          : payment === 'Cash on delivery'
            ? `Place order · ${formatRupees(payable)}`
            : `Pay ${formatRupees(payable)}`}
      </Text>
    </Pressable>
  );

  return (
    <SubScreen title="Checkout" onBack={onBack} onCartPress={onCartPress} footer={footer}>
      <Text style={styles.heading}>Deliver to</Text>
      {addresses.length === 0 ? (
        <Pressable style={styles.addCard} onPress={onManageAddresses}>
          <Text style={styles.addText}>+ Add a delivery address</Text>
        </Pressable>
      ) : (
        <>
          {addresses.map(item => {
            const active = item.id === address?.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setAddressId(item.id)}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>
                    {item.label} · {item.fullName}
                  </Text>
                  <Text style={styles.cardText}>
                    {item.line1}
                    {item.line2 ? `, ${item.line2}` : ''}, {item.district}, {item.state} {item.pincode}
                  </Text>
                  <Text style={styles.cardText}>+91 {item.phone}</Text>
                </View>
              </Pressable>
            );
          })}
          <Pressable onPress={onManageAddresses}>
            <Text style={styles.link}>Add or edit addresses ›</Text>
          </Pressable>
        </>
      )}

      <Text style={styles.heading}>Payment</Text>
      {PAYMENT_METHODS.map(method => {
        const active = method.key === payment;
        return (
          <Pressable
            key={method.key}
            style={[styles.card, active && styles.cardActive]}
            onPress={() => setPayment(method.key)}
          >
            <View style={[styles.radio, active && styles.radioActive]}>
              {active && <View style={styles.radioDot} />}
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{method.title}</Text>
              <Text style={styles.cardText}>{method.note}</Text>
            </View>
          </Pressable>
        );
      })}
      {payError ? <Text style={styles.couponError}>{payError}</Text> : null}
      {payment === 'Paytm' && !isPaytmConfigured() && (
        <Text style={styles.demo}>Demo checkout: Paytm is not connected yet, so no money is charged.</Text>
      )}

      <Text style={styles.heading}>Coupon</Text>
      <View style={styles.couponRow}>
        <TextInput
          style={styles.couponInput}
          value={codeInput}
          onChangeText={text => {
            setCodeInput(text.toUpperCase());
            setCouponError('');
          }}
          placeholder="Enter coupon code"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <Pressable
          style={styles.couponButton}
          onPress={() => (coupon ? (setCoupon(null), setCodeInput('')) : submitCode(codeInput))}
        >
          <Text style={styles.couponButtonText}>{coupon ? 'Remove' : 'Apply'}</Text>
        </Pressable>
      </View>
      {couponError ? <Text style={styles.couponError}>{couponError}</Text> : null}
      {coupon ? (
        <Text style={styles.couponOk}>
          {coupon.coupon.code} applied · {coupon.coupon.description}
        </Text>
      ) : (
        <View style={styles.chips}>
          {availableCoupons.map(item => (
            <Pressable key={item.code} style={styles.chip} onPress={() => submitCode(item.code)}>
              <Text style={styles.chipCode}>{item.code}</Text>
              <Text style={styles.chipText}>{item.description}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.heading}>Order summary</Text>
      <View style={styles.summary}>
        {items.map(item => (
          <View key={item.id} style={styles.line}>
            <Text style={styles.lineTitle} numberOfLines={1}>
              {item.product.title}
            </Text>
            <Text style={styles.lineMeta}>
              {item.size} × {item.quantity}
            </Text>
            <Text style={styles.linePrice}>
              {formatRupees(item.product.sellingPrice * item.quantity)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <SummaryRow label="Subtotal" value={formatRupees(subtotal)} />
        <SummaryRow label="Discount" value={`−${formatRupees(totalDiscount)}`} accent />
        {couponOff > 0 && (
          <SummaryRow label={`Coupon ${coupon?.coupon.code}`} value={`−${formatRupees(couponOff)}`} accent />
        )}
        <SummaryRow
          label="Delivery"
          value={deliveryFee === 0 ? 'Free' : formatRupees(deliveryFee)}
        />
        {deliveryFee > 0 && (
          <Text style={styles.hint}>
            Add {formatRupees(FREE_DELIVERY_ABOVE - afterCoupon)} more for free delivery
          </Text>
        )}
        <View style={styles.divider} />
        <SummaryRow label="Total" value={formatRupees(payable)} bold />
        {address && (
          <Text style={styles.hint}>Estimated delivery · {estimatedDelivery(new Date().toISOString())}</Text>
        )}
      </View>
    </SubScreen>
  );
}

function SummaryRow({
  label,
  value,
  accent,
  bold,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <View style={styles.sumRow}>
      <Text style={[styles.sumLabel, bold && styles.sumBold]}>{label}</Text>
      <Text style={[styles.sumValue, accent && styles.sumAccent, bold && styles.sumBold]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  couponRow: { flexDirection: 'row', gap: 10 },
  couponInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 14,
    color: colors.heading,
  },
  couponButton: { paddingHorizontal: 20, justifyContent: 'center', borderRadius: 12, backgroundColor: colors.primary },
  couponButtonText: { fontSize: 14, fontWeight: '700', color: colors.white },
  couponError: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#B3261E' },
  couponOk: { marginTop: 8, marginBottom: 6, fontSize: 12, fontWeight: '700', color: colors.deepGreen },
  chips: { marginTop: 10, marginBottom: 6, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gold,
    backgroundColor: colors.surface,
  },
  chipCode: { fontSize: 13, fontWeight: '800', color: colors.goldText },
  chipText: { flex: 1, fontSize: 12, color: colors.textSecondary },
  heading: {
    marginTop: 8,
    marginBottom: 10,
    fontFamily: displayFont,
    fontSize: 18,
    fontWeight: '700',
    color: colors.heading,
  },
  card: {
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
  cardActive: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.heading },
  cardText: { marginTop: 2, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  link: { marginBottom: 14, fontSize: 13, fontWeight: '700', color: colors.primary },
  addCard: {
    padding: 18,
    marginBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
  },
  addText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  demo: { marginBottom: 14, fontSize: 12, color: colors.textSecondary },
  summary: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  line: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  lineTitle: { flex: 1, fontSize: 13, color: colors.heading },
  lineMeta: { fontSize: 12, color: colors.textSecondary },
  linePrice: { fontSize: 13, fontWeight: '700', color: colors.heading },
  divider: { height: 1, marginVertical: 8, backgroundColor: colors.border },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  sumLabel: { fontSize: 13, color: colors.textSecondary },
  sumValue: { fontSize: 13, fontWeight: '600', color: colors.heading },
  sumAccent: { color: colors.deepGreen },
  sumBold: { fontSize: 16, fontWeight: '800', color: colors.heading },
  hint: { marginTop: 6, fontSize: 12, color: colors.goldText },
  payButton: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  payDisabled: { opacity: 0.5 },
  payText: { fontSize: 15, fontWeight: '700', color: colors.white },
});
