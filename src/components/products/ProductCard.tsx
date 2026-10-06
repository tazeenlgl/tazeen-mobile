import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { Product } from '../../types/product';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

const MAX_VISIBLE_SIZES = 4;

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

function getStockLabel(stock: number): string {
  if (stock === 0) {
    return 'Out of stock';
  }
  if (stock <= 5) {
    return `Only ${stock} left`;
  }
  return 'In stock';
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const visibleSizes = product.sizes.slice(0, MAX_VISIBLE_SIZES);
  const extraSizeCount = product.sizes.length - visibleSizes.length;
  const primaryOffer = product.offers[0];

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(product)}
    >
      <View style={[styles.imageArea, { backgroundColor: product.imageTint }]}>
        {product.discount > 0 && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>SALE</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.sizesRow}>
          {visibleSizes.map(size => (
            <Text key={size} style={styles.sizeChip}>
              {size}
            </Text>
          ))}
          {extraSizeCount > 0 && (
            <Text style={styles.sizeChip}>+{extraSizeCount}</Text>
          )}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.sellingPrice}>
            {formatRupees(product.sellingPrice)}
          </Text>
          <Text style={styles.mrp}>{formatRupees(product.mrp)}</Text>
          {product.discount > 0 && (
            <Text style={styles.discount}>{product.discount}% OFF</Text>
          )}
        </View>

        {primaryOffer ? (
          <Text style={styles.offer} numberOfLines={1}>
            {primaryOffer}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <Text
            style={[styles.stock, isOutOfStock && styles.stockOut]}
            numberOfLines={1}
          >
            {getStockLabel(product.stock)}
          </Text>
          <Pressable
            style={[styles.addButton, isOutOfStock && styles.addButtonDisabled]}
            disabled={isOutOfStock}
            onPress={() => onPress?.(product)}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageArea: {
    aspectRatio: 0.85,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  saleBadge: {
    margin: 8,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  saleBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
    lineHeight: 17,
    minHeight: 34,
    marginBottom: 6,
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  sizeChip: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginRight: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  sellingPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginRight: 6,
  },
  mrp: {
    fontSize: 12,
    color: colors.placeholder,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  offer: {
    fontSize: 11,
    color: colors.deepGreen,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stock: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    flexShrink: 1,
  },
  stockOut: {
    color: colors.primaryDark,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonDisabled: {
    backgroundColor: colors.placeholder,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
