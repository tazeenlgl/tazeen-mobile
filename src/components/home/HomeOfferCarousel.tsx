import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import type { HomeOffer } from '../../data/homeOffers';

type HomeOfferCarouselProps = {
  offers: HomeOffer[];
  onPressOffer?: (offer: HomeOffer) => void;
  autoSlideMs?: number;
};

const DEFAULT_AUTO_SLIDE_MS = 4000;

// RN 0.87 types the ScrollView ref via its props, not the class type.
type ScrollViewHandle = React.ComponentProps<typeof ScrollView> extends {
  ref?: React.Ref<infer Handle>;
}
  ? Handle
  : never;

export default function HomeOfferCarousel({
  offers,
  onPressOffer,
  autoSlideMs = DEFAULT_AUTO_SLIDE_MS,
}: HomeOfferCarouselProps) {
  const [width, setWidth] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<ScrollViewHandle>(null);
  // Position within the looped list (index 0 and last are clones).
  const positionRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = offers.length;
  const isLooping = count > 1;
  const slides = isLooping ? [offers[count - 1], ...offers, offers[0]] : offers;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    if (!isLooping || width === 0) {
      return;
    }
    timerRef.current = setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: (positionRef.current + 1) * width,
        animated: true,
      });
    }, autoSlideMs);
  }, [autoSlideMs, isLooping, stopTimer, width]);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  const settle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let position = Math.round(event.nativeEvent.contentOffset.x / width);
    // Landed on a clone: jump (without animation) to the real slide.
    if (position === 0) {
      position = count;
      scrollRef.current?.scrollTo({ x: position * width, animated: false });
    } else if (position === count + 1) {
      position = 1;
      scrollRef.current?.scrollTo({ x: position * width, animated: false });
    }
    positionRef.current = position;
    setActiveDot(position - 1);
    startTimer();
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  if (count === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper} onLayout={handleLayout}>
      {width > 0 && (
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: isLooping ? width : 0, y: 0 }}
          onScrollBeginDrag={stopTimer}
          onMomentumScrollEnd={settle}
          scrollEventThrottle={16}
          style={styles.scroller}
        >
          {slides.map((offer, index) => (
            <View key={`${offer.id}-${index}`} style={{ width }}>
              <View style={styles.card}>
                <View style={styles.decoration} />
                <Text style={styles.title} numberOfLines={2}>
                  {offer.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                  {offer.description}
                </Text>
                <Pressable
                  style={styles.cta}
                  onPress={() => onPressOffer?.(offer)}
                >
                  <Text style={styles.ctaText}>{offer.cta}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {isLooping && (
        <View style={styles.dots} pointerEvents="none">
          {offers.map((offer, index) => (
            <View
              key={offer.id}
              style={[styles.dot, index === activeDot && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 152,
    marginBottom: 16,
  },
  scroller: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 18,
    overflow: 'hidden',
  },
  decoration: {
    position: 'absolute',
    top: -36,
    right: -28,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.glassSurface,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 4,
    paddingRight: 40,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  ctaText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  dots: {
    position: 'absolute',
    right: 20,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.placeholder,
    marginLeft: 6,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
});
