import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import TopBar from '../components/common/TopBar';
import BottomNavigation from '../components/home/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../context/AddressContext';
import { useOrders } from '../context/OrderContext';

type ProfileScreenProps = {
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onNavigate?: (key: string) => void;
  onCartPress: () => void;
  onOpenAddresses: () => void;
  onOpenChangePhone: () => void;
  onOpenChangePin: () => void;
};

// Placeholder customer data: Profile backend integration is not yet confirmed.
const customer = {
  name: 'Ayesha Khan',
  email: 'hello@tazeen.in',
  dateOfBirth: '12 / 04 / 1996',
  points: '1,250',
  wallet: '₹320',
};

type MenuRow = {
  key: string;
  glyph: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export default function ProfileScreen({
  onMenuPress,
  onNavigate,
  onCartPress,
  onOpenAddresses,
  onOpenChangePhone,
  onOpenChangePin,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addresses } = useAddresses();
  const { orders } = useOrders();
  const navBarBottomOffset = insets.bottom + 16;
  const phone = user?.phone ?? '9242712601';
  const defaultAddress = addresses.find(item => item.isDefault);

  const rows: MenuRow[] = [
    {
      key: 'addresses',
      glyph: '⌂',
      title: 'My addresses',
      subtitle: addresses.length
        ? `${addresses.length} saved${defaultAddress ? ` · ${defaultAddress.label} is default` : ''}`
        : 'Add a delivery address',
      onPress: onOpenAddresses,
    },
    {
      key: 'phone',
      glyph: '✆',
      title: 'Phone number',
      subtitle: `+91 ${phone} · Change your login number`,
      onPress: onOpenChangePhone,
    },
    {
      key: 'pin',
      glyph: '✱',
      title: 'Change PIN',
      subtitle: 'Update your sign-in PIN',
      onPress: onOpenChangePin,
    },
    {
      key: 'dob',
      glyph: '◆',
      title: 'Date of birth',
      subtitle: customer.dateOfBirth,
    },
  ];

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 10,
            paddingBottom: navBarBottomOffset + 110,
          },
        ]}
      >
        <TopBar title="My profile" onMenuPress={onMenuPress} onCartPress={onCartPress} />

        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.contact}>
            +91 {phone}  ·  {customer.email}
          </Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={[styles.stat, styles.statMiddle]}>
              <Text style={styles.statValue}>{customer.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{customer.wallet}</Text>
              <Text style={styles.statLabel}>Wallet</Text>
            </View>
          </View>
        </View>

        <View style={styles.menu}>
          {rows.map((row, index) => (
            <Pressable
              key={row.key}
              style={[styles.row, index === rows.length - 1 && styles.rowLast]}
              onPress={row.onPress}
              disabled={!row.onPress}
            >
              <View style={styles.rowIcon}>
                <Text style={styles.rowGlyph}>{row.glyph}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                <Text style={styles.rowSubtitle} numberOfLines={1}>
                  {row.subtitle}
                </Text>
              </View>
              {row.onPress ? <Text style={styles.chevron}>›</Text> : null}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation
        activeKey="profile"
        onChange={key => onNavigate?.(key)}
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
  hero: {
    alignItems: 'center',
    marginTop: 18,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  avatarText: {
    fontFamily: displayFont,
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    marginTop: 12,
    fontFamily: displayFont,
    fontSize: 22,
    fontWeight: '700',
    color: colors.heading,
  },
  contact: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.heading,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  menu: {
    marginTop: 18,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
  },
  rowGlyph: {
    fontSize: 18,
    color: colors.primary,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 26,
    color: colors.textSecondary,
  },
});
