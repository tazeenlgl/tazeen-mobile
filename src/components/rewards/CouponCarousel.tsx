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
import { Clipboard } from 'react-native';
import { colors } from '../../theme/colors';
import Barcode from './Barcode';
import type { Coupon } from '../../types/rewards';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 70;
const CARD_SPACING = 12;
const SLOT_WIDTH = CARD_WIDTH + CARD_SPACING;

type CouponTicketProps = {
  coupon: Coupon;
};

function CouponTicket({ coupon }: CouponTicketProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={[styles.ticket, { width: CARD_WIDTH }]}>
      <View style={styles.notchLeft} />
      <View style={styles.notchRight} />

      <View style={styles.ticketHeader}>
        <Text style={styles.discount}>{coupon.label}</Text>
        {coupon.status && (
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{coupon.status}</Text>
          </View>
        )}
      </View>

      <Text style={styles.condition} numberOfLines={1}>
        {coupon.condition}
      </Text>

      <View style={styles.validRow}>
        <Text style={styles.validLabel}>Valid till</Text>
        <Text style={styles.validValue}>{coupon.validTill}</Text>
      </View>

      <View style={styles.dashedDivider} />

      <View style={styles.codeRow}>
        <Text style={styles.code}>{coupon.code}</Text>
        <Pressable style={styles.copyButton} onPress={handleCopy}>
          <Text style={styles.copyButtonText}>
            {copied ? 'Copied ✓' : 'Copy'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.barcodeWrap}>
        <Barcode value={coupon.code} unitWidth={1.4} height={24} />
      </View>
    </View>
  );
}

type CouponCarouselProps = {
  coupons: Coupon[];
};

export default function CouponCarousel({ coupons }: CouponCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (coupons.length === 0) {
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
        {coupons.map((coupon, index) => (
          <View
            key={coupon.id}
            style={{
              marginRight: index === coupons.length - 1 ? 0 : CARD_SPACING,
            }}
          >
            <CouponTicket coupon={coupon} />
          </View>
        ))}
      </ScrollView>

      {coupons.length > 1 && (
        <View style={styles.dots}>
          {coupons.map((coupon, index) => (
            <View
              key={coupon.id}
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
  ticket: {
    backgroundColor: colors.softAmber,
    borderWidth: 1,
    borderColor: colors.softAmberBorder,
    borderRadius: 14,
    padding: 10,
    overflow: 'hidden',
  },
  notchLeft: {
    position: 'absolute',
    left: -10,
    top: '50%',
    marginTop: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  notchRight: {
    position: 'absolute',
    right: -10,
    top: '50%',
    marginTop: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  discount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.amber,
  },
  statusPill: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  statusPillText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.amber,
  },
  condition: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  validRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  validLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginRight: 6,
  },
  validValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.heading,
  },
  dashedDivider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.softAmberBorder,
    marginBottom: 6,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  code: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.heading,
  },
  copyButton: {
    backgroundColor: colors.amber,
    borderRadius: 7,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  copyButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  barcodeWrap: {
    alignItems: 'flex-start',
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
    backgroundColor: colors.amber,
    width: 16,
  },
});
