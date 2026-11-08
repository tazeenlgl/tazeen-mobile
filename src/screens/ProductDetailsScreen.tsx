import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import HeartButton from '../components/common/HeartButton';
import SizeGuideSheet from '../components/products/SizeGuideSheet';
import TopBar from '../components/common/TopBar';
import ProductDetailsHeader from '../components/products/ProductDetailsHeader';
import ProductRating from '../components/products/ProductRating';
import SizeSelector from '../components/products/SizeSelector';
import OfferCarousel from '../components/products/OfferCarousel';
import DeliveryChecker from '../components/products/DeliveryChecker';
import KeyFeatures from '../components/products/KeyFeatures';
import RelatedProducts from '../components/products/RelatedProducts';
import CustomerFeedback from '../components/products/CustomerFeedback';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';
import type { ProductOffer } from '../types/offer';

type ProductDetailsScreenProps = {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: () => void;
  onBack: () => void;
  onCartPress: () => void;
  onTryItOn: (product: Product) => void;
  onBuyNow: () => void;
};

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

function getStockLabel(stock: number): string {
  if (stock === 0) {
    return 'Out of stock';
  }
  if (stock <= 10) {
    return `Only ${stock} left`;
  }
  return '✓ In stock';
}

// This single screen renders any Product passed to it — there is no
// per-category or per-product variant.
export default function ProductDetailsScreen({
  product,
  onSelectProduct,
  onAddToCart,
  onBack,
  onCartPress,
  onTryItOn,
  onBuyNow,
}: ProductDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [appliedOfferId, setAppliedOfferId] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setSelectedSize(null);
    setAppliedOfferId(null);
    setSizeError(false);
  }, [product.id]);

  const handleApplyOffer = (offer: ProductOffer) => {
    setAppliedOfferId(offer.id);
  };

  const appliedOffer = product.offerDetails.find(
    offer => offer.id === appliedOfferId,
  );

  const relatedProducts = useMemo(() => {
    const sameCategory = products.filter(
      item => item.id !== product.id && item.category === product.category,
    );
    if (sameCategory.length >= 2) {
      return sameCategory.slice(0, 2);
    }
    const fallback = products.filter(
      item =>
        item.id !== product.id &&
        !sameCategory.some(related => related.id === item.id),
    );
    return [...sameCategory, ...fallback].slice(0, 2);
  }, [product]);

  const lookProducts = useMemo(() => {
    const pairs: Record<string, string[]> = {
      suits: ['kurties', 'pants'],
      kurties: ['pants', 'bottom-wear'],
      tops: ['pants', 'bottom-wear'],
      pants: ['kurties', 'tops'],
      'bottom-wear': ['kurties', 'tops'],
    };
    const wanted = pairs[product.category] ?? [];
    return products
      .filter(item => item.id !== product.id && wanted.includes(item.category))
      .slice(0, 2);
  }, [product]);

  const isOutOfStock = product.stock === 0;
  const resolvedSize = product.sizes.length === 0 ? 'One Size' : selectedSize;
  const isAddToCartDisabled = isOutOfStock;

  const handleAddToCart = () => {
    if (!resolvedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, resolvedSize, appliedOffer);
    onAddToCart();
  };

  const handleBuyNow = () => {
    if (!resolvedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, resolvedSize, appliedOffer);
    onBuyNow();
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          styles.centered,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 110 },
        ]}
      >
        <TopBar
          onBack={onBack}
          onCartPress={onCartPress}
          rightAccessory={<HeartButton productId={product.id} size={44} style={styles.topHeart} />}
        />

        <ProductDetailsHeader
          images={product.images ?? []}
          imageTint={product.imageTint}
        />

        <Text style={styles.productName}>{product.title}</Text>

        {product.category === 'suits' && product.tryOnEnabled && (
          product.tryOnModelImage ? (
            <Pressable
              style={styles.tryOnButton}
              onPress={() => onTryItOn(product)}
            >
              <Text style={styles.tryOnButtonText}>✨ Try It On</Text>
            </Pressable>
          ) : (
            <View style={styles.tryOnUnavailable}>
              <Text style={styles.tryOnUnavailableText}>
                Try It On unavailable for this item
              </Text>
            </View>
          )
        )}

        <ProductRating rating={product.rating} reviewCount={product.reviewCount} />

        <View style={styles.priceRow}>
          <Text style={styles.sellingPrice}>
            {formatRupees(product.sellingPrice)}
          </Text>
          <Text style={styles.mrp}>{formatRupees(product.mrp)}</Text>
          {product.discount > 0 && (
            <Text style={styles.discount}>{product.discount}% OFF</Text>
          )}
        </View>

        <Text
          style={[styles.stock, isOutOfStock && styles.stockOut]}
        >
          {getStockLabel(product.stock)}
        </Text>

        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSelect={size => {
            setSelectedSize(size);
            setSizeError(false);
          }}
          showError={sizeError}
          onOpenGuide={() => setGuideOpen(true)}
        />
        <Text style={styles.fitNote}>
          Regular fit · model is 5'6" and wears size S. Between sizes? Go one size up.
        </Text>

        <OfferCarousel
          offers={product.offerDetails}
          appliedOfferId={appliedOfferId}
          onApply={handleApplyOffer}
        />

        <DeliveryChecker />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.description}>{product.shortDescription}</Text>
        </View>

        <KeyFeatures features={product.keyFeatures} />

        <RelatedProducts
          title="Complete the look"
          products={lookProducts}
          onSelect={onSelectProduct}
        />

        <RelatedProducts
          products={relatedProducts}
          onSelect={onSelectProduct}
        />

        <CustomerFeedback
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </ScrollView>

      <View
        style={[styles.actionBar, { paddingBottom: insets.bottom + 14 }]}
      >
        <Pressable
          style={[
            styles.secondaryButton,
            isAddToCartDisabled && styles.buttonDisabled,
          ]}
          disabled={isAddToCartDisabled}
          onPress={handleAddToCart}
        >
          <Text style={styles.secondaryButtonText}>Add to Cart</Text>
        </Pressable>
        <Pressable
          style={[styles.primaryButton, isOutOfStock && styles.buttonDisabled]}
          disabled={isOutOfStock}
          onPress={handleBuyNow}
        >
          <Text style={styles.primaryButtonText}>Buy Now</Text>
        </Pressable>
      </View>
      <SizeGuideSheet
        visible={guideOpen}
        onClose={() => setGuideOpen(false)}
        selectedSize={selectedSize}
      />
    </View>
  );
}

const MAX_DETAILS_WIDTH = 640;

const styles = StyleSheet.create({
  topHeart: { marginRight: 8 },
  fitNote: { marginTop: -12, marginBottom: 18, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  centered: {
    width: '100%',
    maxWidth: MAX_DETAILS_WIDTH,
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  productName: {
    fontFamily: displayFont,
    fontSize: 22,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 8,
  },
  tryOnButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginBottom: 10,
  },
  tryOnButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  tryOnUnavailable: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginBottom: 10,
  },
  tryOnUnavailableText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.placeholder,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  sellingPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.heading,
    marginRight: 10,
  },
  mrp: {
    fontSize: 14,
    color: colors.placeholder,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.goldText,
  },
  stock: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.deepGreen,
    marginBottom: 20,
  },
  stockOut: {
    color: colors.primaryDark,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
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
    fontSize: 14,
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
  buttonDisabled: {
    opacity: 0.45,
  },
});
