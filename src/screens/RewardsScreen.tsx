import React, { useState } from 'react';
import { LogBox, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import TopBar from '../components/common/TopBar';
import BottomNavigation from '../components/home/BottomNavigation';
import GiftCardCarousel from '../components/rewards/GiftCardCarousel';
import CouponCarousel from '../components/rewards/CouponCarousel';
import WalletPointsRow from '../components/rewards/WalletPointsRow';
import {
  coupons,
  giftCards,
  pointsBalance,
  walletBalance,
} from '../data/rewards';

// `Clipboard` is still shipped by react-native core (just deprecated in
// favor of a standalone package); suppress its noisy per-call warning
// rather than pulling in a new native dependency for one copy action.
LogBox.ignoreLogs(['Clipboard has been extracted']);

type RewardsScreenProps = {
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onNavigate?: (key: string) => void;
  onCartPress: () => void;
};

export default function RewardsScreen({
  drawerOpen,
  onMenuPress,
  onDrawerClose,
  onNavigate,
  onCartPress,
}: RewardsScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeNav, setActiveNav] = useState('rewards');

  const navBarBottomOffset = insets.bottom + 16;
  const navBarClearance = navBarBottomOffset + 76;

  const handleNavChange = (key: string) => {
    setActiveNav(key);
    onNavigate?.(key);
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 10,
            paddingBottom: navBarClearance + 16,
          },
        ]}
      >
        <TopBar logo onMenuPress={onMenuPress} onCartPress={onCartPress} />

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Rewards</Text>
          <Text style={styles.pageSubtitle}>
            Shop More • Earn More • Enjoy More
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Gift Cards</Text>
        <GiftCardCarousel cards={giftCards} />

        <View style={styles.spacer} />
        <WalletPointsRow
          walletBalance={walletBalance}
          pointsBalance={pointsBalance}
        />

        <Text style={[styles.sectionTitle, styles.couponsTitle]}>
          Coupons
        </Text>
        <CouponCarousel coupons={coupons} />
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
  content: {
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  titleRow: {
    marginTop: 8,
    marginBottom: 20,
  },
  pageTitle: {
    fontFamily: displayFont,
    fontSize: 30,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    letterSpacing: 0.3,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: displayFont,
    fontSize: 19,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 12,
  },
  couponsTitle: {
    marginTop: 26,
  },
  spacer: {
    height: 20,
  },
});
