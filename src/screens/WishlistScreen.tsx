import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import SubScreen from '../components/common/SubScreen';
import ProductCard from '../components/products/ProductCard';
import { products } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../types/product';

type WishlistScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
  onSelectProduct: (product: Product) => void;
  onBrowseProducts: () => void;
};

export default function WishlistScreen({
  onBack,
  onCartPress,
  onSelectProduct,
  onBrowseProducts,
}: WishlistScreenProps) {
  const { ids } = useWishlist();
  const saved = ids
    .map(id => products.find(product => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return (
    <SubScreen title="My wishlist" onBack={onBack} onCartPress={onCartPress}>
      {saved.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.heart}>♡</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyBody}>Tap the heart on any outfit to keep it here.</Text>
          <Pressable style={styles.button} onPress={onBrowseProducts}>
            <Text style={styles.buttonText}>Browse products</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.grid}>
          {saved.map(product => (
            <ProductCard key={product.id} product={product} onPress={onSelectProduct} />
          ))}
        </View>
      )}
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  heart: { fontSize: 48, color: colors.primary },
  emptyTitle: { marginTop: 8, fontSize: 17, fontWeight: '700', color: colors.heading },
  emptyBody: { marginTop: 6, fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  button: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonText: { fontSize: 14, fontWeight: '700', color: colors.white },
});
