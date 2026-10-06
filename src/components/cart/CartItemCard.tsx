import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { CartItem } from '../../context/CartContext';

type CartItemCardProps = {
  item: CartItem;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
};

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) {
  const { product, size, quantity } = item;
  const isOutOfStock = product.stock === 0;

  return (
    <View style={styles.card}>
      <View style={[styles.image, { backgroundColor: product.imageTint }]} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.size}>Size: {size}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.sellingPrice}>
            {formatRupees(product.sellingPrice)}
          </Text>
          <Text style={styles.mrp}>{formatRupees(product.mrp)}</Text>
          {product.discount > 0 && (
            <Text style={styles.discount}>{product.discount}% OFF</Text>
          )}
        </View>

        {isOutOfStock && <Text style={styles.outOfStock}>Out of stock</Text>}

        <View style={styles.footerRow}>
          <View style={styles.quantityRow}>
            <Pressable
              style={styles.quantityButton}
              onPress={() => onDecrement(item.id)}
            >
              <Text style={styles.quantityButtonText}>{'−'}</Text>
            </Pressable>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Pressable
              style={styles.quantityButton}
              onPress={() => onIncrement(item.id)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => onRemove(item.id)}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 84,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
    marginBottom: 4,
  },
  size: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  sellingPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.heading,
    marginRight: 6,
  },
  mrp: {
    fontSize: 11,
    color: colors.placeholder,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  outOfStock: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  quantityButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  quantityValue: {
    minWidth: 22,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: colors.heading,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
