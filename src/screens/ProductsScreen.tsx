import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';
import BottomNavigation from '../components/home/BottomNavigation';
import CategoryFilter from '../components/products/CategoryFilter';
import ProductFilterBar from '../components/products/ProductFilterBar';
import ProductCard from '../components/products/ProductCard';
import { products } from '../data/products';
import { productCategories } from '../data/productCategories';
import type { Product } from '../types/product';

type ProductsScreenProps = {
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onNavigate?: (key: string) => void;
  onSelectProduct: (product: Product) => void;
  onCartPress: () => void;
};

export default function ProductsScreen({
  drawerOpen,
  onMenuPress,
  onDrawerClose,
  onNavigate,
  onSelectProduct,
  onCartPress,
}: ProductsScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeNav, setActiveNav] = useState('products');
  const [activeCategoryId, setActiveCategoryId] = useState('all');

  const navBarBottomOffset = insets.bottom + 16;
  const navBarClearance = navBarBottomOffset + 80;

  const visibleProducts = useMemo(() => {
    if (activeCategoryId === 'all') {
      return products;
    }
    return products.filter(product => product.category === activeCategoryId);
  }, [activeCategoryId]);

  const handleNavChange = (key: string) => {
    setActiveNav(key);
    onNavigate?.(key);
  };

  return (
    <View style={styles.flex}>
      <FlatList
        data={visibleProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + 16,
            paddingBottom: navBarClearance,
          },
        ]}
        ListHeaderComponent={
          <View>
            <TopBar
              title="Products"
              onMenuPress={onMenuPress}
              onCartPress={onCartPress}
              rightAccessory={
                <Text style={styles.searchIcon}>{'\u{1F50D}'}</Text>
              }
            />

            <View style={styles.categoryWrap}>
              <CategoryFilter
                categories={productCategories}
                activeCategoryId={activeCategoryId}
                onSelect={setActiveCategoryId}
              />
            </View>

            <ProductFilterBar />
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={onSelectProduct} />
        )}
      />

      <BottomNavigation
        activeKey={activeNav}
        onChange={handleNavChange}
        bottomOffset={navBarBottomOffset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  searchIcon: {
    fontSize: 18,
  },
  categoryWrap: {
    marginBottom: 12,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
});
