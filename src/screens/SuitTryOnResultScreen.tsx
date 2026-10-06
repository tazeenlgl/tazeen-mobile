import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { generateTryOnResult } from '../services/tryOn/generateTryOnResult';
import type { Product } from '../types/product';
import type { TryOnResult } from '../types/tryOn';

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

type SuitTryOnResultScreenProps = {
  product: Product;
  customerFaceUri: string;
  onTryAnotherPhoto: () => void;
  onAddToCart: (result: TryOnResult) => void;
};

export default function SuitTryOnResultScreen({
  product,
  customerFaceUri,
  onTryAnotherPhoto,
  onAddToCart,
}: SuitTryOnResultScreenProps) {
  const insets = useSafeAreaInsets();
  const [result, setResult] = useState<TryOnResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    generateTryOnResult({
      customerFaceUri,
      tryOnModelImage: product.tryOnModelImage ?? product.imageTint,
      productId: product.id,
    }).then(generated => {
      if (!cancelled) {
        setResult(generated);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [customerFaceUri, product]);

  if (!result) {
    return (
      <View style={[styles.flex, styles.processing]}>
        <ActivityIndicator color={colors.white} size="large" />
        <Text style={styles.processingTitle}>Creating Your Look</Text>
        <Text style={styles.processingSubtitle}>
          Applying your face to this suit...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <View style={styles.imageCard}>
          <View
            style={[styles.image, { backgroundColor: result.resultImage }]}
          />
        </View>

        <Text style={styles.productName}>{product.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.sellingPrice}>
            {formatRupees(product.sellingPrice)}
          </Text>
          <Text style={styles.mrp}>{formatRupees(product.mrp)}</Text>
          {product.discount > 0 && (
            <Text style={styles.discount}>{product.discount}% OFF</Text>
          )}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.secondaryButton} onPress={onTryAnotherPhoto}>
          <Text style={styles.secondaryButtonText}>Try Another Photo</Text>
        </Pressable>
        <Pressable
          style={styles.primaryButton}
          onPress={() => onAddToCart(result)}
        >
          <Text style={styles.primaryButtonText}>Add to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  processing: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.heading,
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginTop: 18,
  },
  processingSubtitle: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.8,
    marginTop: 6,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageCard: {
    width: 260,
    height: 340,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.heading,
    textAlign: 'center',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  sellingPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.heading,
    marginRight: 10,
  },
  mrp: {
    fontSize: 13,
    color: colors.placeholder,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 10,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
