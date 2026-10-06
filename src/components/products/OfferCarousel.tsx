import React, { useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import type { ProductOffer, OfferType } from '../../types/offer';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 60;
const CARD_SPACING = 12;

const OFFER_ICONS: Record<OfferType, string> = {
  bank: '\u{1F3E6}',
  bulk: '\u{1F381}',
  payment: '\u{1F4B3}',
  coupon: '\u{1F3F7}\u{FE0F}',
  seasonal: '\u{2728}',
};

type OfferCarouselProps = {
  offers: ProductOffer[];
  appliedOfferId: string | null;
  onApply: (offer: ProductOffer) => void;
};

export default function OfferCarousel({
  offers,
  appliedOfferId,
  onApply,
}: OfferCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (offers.length === 0) {
    return null;
  }

  const slotWidth = CARD_WIDTH + CARD_SPACING;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / slotWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Offers</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={slotWidth}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {offers.map((offer, index) => {
          const isApplied = offer.id === appliedOfferId;
          const isLast = index === offers.length - 1;
          return (
            <View
              key={offer.id}
              style={[
                styles.card,
                { width: CARD_WIDTH, marginRight: isLast ? 0 : CARD_SPACING },
                isApplied && styles.cardApplied,
                !offer.applicable && styles.cardDisabled,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.icon}>{OFFER_ICONS[offer.type]}</Text>
                <View style={styles.headerText}>
                  <Text style={styles.offerTitle} numberOfLines={1}>
                    {offer.title}
                  </Text>
                  <Text style={styles.offerValue}>{offer.value}</Text>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {offer.description}
              </Text>

              <Text
                style={[
                  styles.eligibility,
                  !offer.applicable && styles.eligibilityUnavailable,
                ]}
                numberOfLines={1}
              >
                {offer.applicable
                  ? offer.eligibility
                  : offer.unavailableReason ?? 'Not applicable'}
              </Text>

              <Pressable
                style={[
                  styles.applyButton,
                  isApplied && styles.applyButtonApplied,
                  !offer.applicable && styles.applyButtonDisabled,
                ]}
                disabled={!offer.applicable}
                onPress={() => onApply(offer)}
              >
                <Text
                  style={[
                    styles.applyButtonText,
                    isApplied && styles.applyButtonTextApplied,
                  ]}
                >
                  {isApplied ? 'Applied ✓' : 'Apply'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      {offers.length > 1 && (
        <View style={styles.dots}>
          {offers.map((offer, index) => (
            <View
              key={offer.id}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 10,
  },
  scrollContent: {
    paddingRight: 0,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
  },
  cardApplied: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerText: {
    flexShrink: 1,
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.heading,
  },
  offerValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  description: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginBottom: 6,
  },
  eligibility: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.deepGreen,
    marginBottom: 10,
  },
  eligibilityUnavailable: {
    color: colors.primaryDark,
  },
  applyButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  applyButtonApplied: {
    backgroundColor: colors.primary,
  },
  applyButtonDisabled: {
    borderColor: colors.border,
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  applyButtonTextApplied: {
    color: colors.white,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
