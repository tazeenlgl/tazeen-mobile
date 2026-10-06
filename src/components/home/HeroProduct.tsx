import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import type { Product } from '../../types/product';

type HeroProductProps = {
  product: Product;
  onPress: (product: Product) => void;
};

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

// Large tappable hero card for a real catalog product. The whole card
// (photo, text and "View Product") opens the existing Product Details.
export default function HeroProduct({ product, onPress }: HeroProductProps) {
  const { width } = useWindowDimensions();
  const photo = product.images?.[0];
  if (!photo) {
    return null;
  }

  return (
    <Pressable style={styles.card} onPress={() => onPress(product)}>
      <Image
        source={photo}
        style={[styles.image, { height: Math.round((width - 40) * 1.05) }]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.eyebrow}>New Cotton Collection</Text>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatRupees(product.sellingPrice)}</Text>
            <Text style={styles.mrp}>{formatRupees(product.mrp)}</Text>
            {product.discount > 0 && (
              <Text style={styles.discount}>{product.discount}% OFF</Text>
            )}
          </View>
          <Text style={styles.cta}>View Product →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 18,
  },
  image: {
    width: '100%',
    backgroundColor: colors.primaryTint,
  },
  info: {
    padding: 14,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.heading,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.heading,
  },
  mrp: {
    fontSize: 12,
    color: colors.placeholder,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  cta: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
});
