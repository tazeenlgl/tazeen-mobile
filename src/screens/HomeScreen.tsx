import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';
import HeroProduct from '../components/home/HeroProduct';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryGrid from '../components/home/CategoryGrid';
import PromoCard from '../components/home/PromoCard';
import HomeOfferCarousel from '../components/home/HomeOfferCarousel';
import BottomNavigation from '../components/home/BottomNavigation';
import { categories } from '../data/categories';
import { homeOffers } from '../data/homeOffers';
import { products } from '../data/products';
import type { Product } from '../types/product';

type HomeScreenProps = {
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onNavigate?: (key: string) => void;
  onSelectProduct: (product: Product) => void;
  onCartPress: () => void;
};

export default function HomeScreen({
  drawerOpen,
  onMenuPress,
  onDrawerClose,
  onNavigate,
  onSelectProduct,
  onCartPress,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeNav, setActiveNav] = useState('home');
  const heroProduct = products.find(p => p.images && p.images.length > 0);

  const navBarBottomOffset = insets.bottom + 16;
  const navBarClearance = navBarBottomOffset + 80;

  const handleNavChange = (key: string) => {
    setActiveNav(key);
    onNavigate?.(key);
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: navBarClearance,
          },
        ]}
      >
        <TopBar
          logo
          onMenuPress={onMenuPress}
          onCartPress={onCartPress}
        />

        {heroProduct && (
          <>
            <HeroProduct product={heroProduct} onPress={onSelectProduct} />
            {heroProduct.images && heroProduct.images.length > 1 && (
              <View style={styles.lookSection}>
                <Text style={styles.sectionTitle}>Shop the Look</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.lookRow}
                >
                  {heroProduct.images.slice(1).map((photo, index) => (
                    <Pressable
                      key={index}
                      onPress={() => onSelectProduct(heroProduct)}
                    >
                      <Image source={photo} style={styles.lookImage} resizeMode="cover" />
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}

        <FeaturedProducts
          products={products.filter(p => p.id !== heroProduct?.id)}
          onSelectProduct={onSelectProduct}
        />

        <CategoryGrid categories={categories} />

        <HomeOfferCarousel
          offers={homeOffers}
          onPressOffer={() => handleNavChange('products')}
        />
        <PromoCard title="Today's Best Deals" />
      </ScrollView>

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
  scrollContent: {
    paddingHorizontal: 20,
  },
  lookSection: {
    marginBottom: 18,
  },
  lookRow: {
    gap: 10,
  },
  lookImage: {
    width: 96,
    height: 128,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 12,
  },
});
