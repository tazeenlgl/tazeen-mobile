import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { Product } from '../../types/product';

type FeaturedProductsProps = {
  products: Product[];
  onSelectProduct: (product: Product) => void;
};

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

// Horizontal row of catalog products that have real photos. Each card
// opens the existing Product Details for that exact product.
export default function FeaturedProducts({
  products,
  onSelectProduct,
}: FeaturedProductsProps) {
  const withPhotos = products.filter(p => p.images && p.images.length > 0);
  if (withPhotos.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Featured</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {withPhotos.map(product => (
          <Pressable
            key={product.id}
            style={styles.card}
            onPress={() => onSelectProduct(product)}
          >
            <Image
              source={product.images![0]}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {product.title}
              </Text>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.price}>{formatRupees(product.sellingPrice)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 10,
  },
  row: {
    gap: 12,
  },
  card: {
    width: 150,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 190,
    backgroundColor: colors.primaryTint,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
  },
  category: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    marginTop: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.heading,
    marginTop: 3,
  },
});
