import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';
import { useCart } from '../context/CartContext';
import CartItemCard from '../components/cart/CartItemCard';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';

type CartScreenProps = {
  onBack?: () => void;
  onMenuPress?: () => void;
  onBrowseProducts?: () => void;
  onCheckout?: () => void;
};

export default function CartScreen({ onBack, onMenuPress, onBrowseProducts, onCheckout }: CartScreenProps) {
  const insets = useSafeAreaInsets();
  const {
    items,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    subtotal,
    totalDiscount,
    total,
  } = useCart();

  const uniqueOffers = useMemo(() => {
    const offers = new Set<string>();
    items.forEach(item => {
      item.product.offers.forEach(offer => offers.add(offer));
    });
    return Array.from(offers);
  }, [items]);

  if (items.length === 0) {
    return (
      <View style={[styles.flex, { paddingTop: insets.top }]}>
        <View style={styles.headerPadded}>
          <TopBar
          title="Cart"
          onMenuPress={onMenuPress}
          onBack={onBack}
          onCartPress={() => {}}
        />
        </View>
        <EmptyCart onBrowseProducts={onBrowseProducts} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <TopBar
          title="Cart"
          onMenuPress={onMenuPress}
          onBack={onBack}
          onCartPress={() => {}}
        />

        {items.map(item => (
          <CartItemCard
            key={item.id}
            item={item}
            onIncrement={incrementQuantity}
            onDecrement={decrementQuantity}
            onRemove={removeItem}
          />
        ))}

        {uniqueOffers.length > 0 && (
          <View style={styles.offersSection}>
            <Text style={styles.offersTitle}>Offers</Text>
            {uniqueOffers.map(offer => (
              <View key={offer} style={styles.offerRow}>
                <Text style={styles.offerIcon}>{'\u{1F381}'}</Text>
                <Text style={styles.offerText}>{offer}</Text>
              </View>
            ))}
          </View>
        )}

        <CartSummary
          subtotal={subtotal}
          totalDiscount={totalDiscount}
          total={total}
          onCheckout={onCheckout}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerPadded: {
    paddingHorizontal: 20,
  },
  offersSection: {
    marginBottom: 16,
  },
  offersTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 10,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softGreen,
    borderWidth: 1,
    borderColor: colors.softGreenBorder,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  offerIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  offerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.deepGreen,
    flexShrink: 1,
  },
});
