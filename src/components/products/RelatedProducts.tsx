import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { Product } from '../../types/product';

type RelatedProductsProps = {
  products: Product[];
  onSelect: (product: Product) => void;
};

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function RelatedProducts({
  products,
  onSelect,
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Related Products</Text>
      <View style={styles.row}>
        {products.map(product => (
          <Pressable
            key={product.id}
            style={styles.card}
            onPress={() => onSelect(product)}
          >
            {product.images?.[0] ? (
              <View style={styles.image}>
                <Image
                  source={product.images[0]}
                  style={styles.photo}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View
                style={[styles.image, { backgroundColor: product.imageTint }]}
              />
            )}
            <Text style={styles.name} numberOfLines={1}>
              {product.title}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.sellingPrice}>
                {formatRupees(product.sellingPrice)}
              </Text>
              <Text style={styles.mrp}>{formatRupees(product.mrp)}</Text>
            </View>
            <Text style={styles.discount}>{product.discount}% OFF</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 0.95,
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.heading,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  sellingPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.heading,
    marginRight: 6,
  },
  mrp: {
    fontSize: 11,
    color: colors.placeholder,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
