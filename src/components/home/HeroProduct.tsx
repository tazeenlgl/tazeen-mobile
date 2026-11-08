import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import type { Product } from '../../types/product';

type HeroCarouselProps = {
  products: Product[];
  onPress: (product: Product) => void;
};

const AUTO_SLIDE_MS = 4000;

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

// Auto-sliding hero with up to four catalog products. Each slide opens
// Product Details. Image height follows the slide width (4:5), so it adapts
// to any screen; the pager resumes auto-slide after the user swipes.
export default function HeroProduct({ products, onPress }: HeroCarouselProps) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(screenWidth - 40, 600);
  const slides = products.filter(p => p.images && p.images.length > 0).slice(0, 6);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2) {
      return undefined;
    }
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % count;
      indexRef.current = next;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [count, width, index]);

  if (count === 0) {
    return null;
  }

  return (
    <View style={[styles.card, { width }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const next = Math.round(e.nativeEvent.contentOffset.x / width);
          indexRef.current = next;
          setIndex(next);
        }}
      >
        {slides.map(product => (
          <Pressable key={product.id} style={{ width }} onPress={() => onPress(product)}>
            <Image
              source={product.images![0]}
              style={[styles.image, { height: Math.round(width * 1.25) }]}
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
                <Text style={styles.cta}>View →</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((p, i) => (
          <View key={p.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
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
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    backgroundColor: colors.primaryTint,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 18, backgroundColor: colors.primary },
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
