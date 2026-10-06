import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Clipboard } from 'react-native';
import { colors } from '../../theme/colors';
import Barcode from './Barcode';
import type { GiftCard } from '../../types/rewards';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const CARD_HEIGHT = CARD_WIDTH * 0.46;
const CARD_SPACING = 14;
const SLOT_WIDTH = CARD_WIDTH + CARD_SPACING;

function maskCardNumber(cardNumber: string): string {
  const last4 = cardNumber.replace(/\s/g, '').slice(-4);
  return `**** **** **** ${last4}`;
}

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

type FlipGiftCardProps = {
  card: GiftCard;
};

function FlipGiftCard({ card }: FlipGiftCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    Animated.spring(progress, {
      toValue: flipped ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
    setFlipped(!flipped);
  };

  const handleCopy = () => {
    Clipboard.setString(card.cardNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const frontRotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = progress.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = progress.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <Pressable
      style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
      onPress={handleFlip}
    >
      <Animated.View
        style={[
          styles.face,
          styles.front,
          {
            opacity: frontOpacity,
            transform: [{ rotateY: frontRotate }],
          },
        ]}
      >
        <View style={styles.ribbon} />
        <Text style={styles.wordmark}>TAZEEN</Text>
        <Text style={styles.wordmarkSub}>GIFT CARD</Text>

        <Text style={styles.greeting}>Hello, {card.holderName}</Text>
        <Text style={styles.maskedNumber}>
          {maskCardNumber(card.cardNumber)}
        </Text>

        <View style={styles.frontFooter}>
          <View>
            <Text style={styles.footerLabel}>Available Balance</Text>
            <Text style={styles.footerValueLarge}>
              {formatRupees(card.balance)}
            </Text>
          </View>
          <View>
            <Text style={styles.footerLabel}>Valid Till</Text>
            <Text style={styles.footerValue}>{card.validTill}</Text>
          </View>
        </View>

        <View style={styles.flipHint}>
          <Text style={styles.flipHintText}>⟲ Tap to flip</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.face,
          styles.back,
          {
            opacity: backOpacity,
            transform: [{ rotateY: backRotate }],
          },
        ]}
      >
        <Text style={styles.backLabel}>Card Number</Text>
        <Text style={styles.backNumber}>{card.cardNumber}</Text>

        <View style={styles.barcodeWrap}>
          <Barcode
            value={card.cardNumber.replace(/\s/g, '')}
            unitWidth={1.6}
            height={28}
            barColor={colors.heading}
          />
        </View>

        <Pressable style={styles.copyButton} onPress={handleCopy}>
          <Text style={styles.copyButtonText}>
            {copied ? 'Copied ✓' : 'Copy Card Number'}
          </Text>
        </Pressable>
        <Text style={styles.backHint}>
          Show this barcode in-store to redeem your gift card balance.
        </Text>
      </Animated.View>
    </Pressable>
  );
}

type GiftCardCarouselProps = {
  cards: GiftCard[];
};

export default function GiftCardCarousel({ cards }: GiftCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (cards.length === 0) {
    return null;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLOT_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.section}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLOT_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((card, index) => (
          <View
            key={card.id}
            style={{
              marginRight: index === cards.length - 1 ? 0 : CARD_SPACING,
            }}
          >
            <FlipGiftCard card={card} />
          </View>
        ))}
      </ScrollView>

      {cards.length > 1 && (
        <View style={styles.dots}>
          {cards.map((card, index) => (
            <View
              key={card.id}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 4,
  },
  scrollContent: {
    paddingRight: 0,
  },
  card: {
    borderRadius: 22,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    padding: 14,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  front: {
    backgroundColor: colors.giftCardDeep,
    justifyContent: 'space-between',
  },
  back: {
    backgroundColor: colors.giftCardDeep,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  ribbon: {
    position: 'absolute',
    top: -30,
    right: 24,
    width: 60,
    height: 220,
    backgroundColor: 'rgba(217, 184, 115, 0.18)',
    transform: [{ rotate: '18deg' }],
  },
  wordmark: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: colors.giftCardAccent,
  },
  wordmarkSub: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
    marginTop: 4,
  },
  maskedNumber: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.white,
    marginTop: 2,
  },
  frontFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 1,
  },
  footerValueLarge: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.giftCardAccent,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  flipHint: {
    position: 'absolute',
    top: 12,
    right: 14,
  },
  flipHintText: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  backLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 2,
  },
  backNumber: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.white,
    marginBottom: 8,
  },
  barcodeWrap: {
    backgroundColor: colors.white,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  copyButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.giftCardAccent,
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginBottom: 6,
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.giftCardDeep,
  },
  backHint: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.55)',
    maxWidth: CARD_WIDTH - 32,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },
});
