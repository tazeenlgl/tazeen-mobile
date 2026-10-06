import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';
import BottomNavigation from '../components/home/BottomNavigation';

type ProfileScreenProps = {
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onNavigate?: (key: string) => void;
  onCartPress: () => void;
};

// Placeholder customer data: Profile backend integration is not yet confirmed.
const customer = {
  name: 'Customer Name',
  phone: '9242712601',
  email: 'hello@tazeen.in',
  dateOfBirth: 'DD / MM / YYYY',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  district: 'District',
  state: 'State',
  pin: 'PIN Code',
};

const company = {
  name: 'Tazeen',
  website: 'www.tazeen.in',
  websiteUrl: 'https://www.tazeen.in',
  phone: '9242712601',
  email: 'hello@tazeen.in',
  addressLines: ['Jal Tank Road, Lalgola,', 'Murshidabad, WB - 742148'],
};

const socials = [
  {
    key: 'instagram',
    label: 'Instagram',
    icon: require('../assets/social/instagram.png'),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: require('../assets/social/facebook.png'),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: require('../assets/social/whatsapp.png'),
  },
];

// Visual-only change control until profile backend functionality exists.
function ChangeIcon({ label }: { label: string }) {
  return (
    <View style={styles.changeIcon} accessibilityLabel={label}>
      <Text style={styles.changeIconText}>{'✎'}</Text>
    </View>
  );
}

export default function ProfileScreen({
  onMenuPress,
  onNavigate,
  onCartPress,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const navBarBottomOffset = insets.bottom + 16;

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 10,
            paddingBottom: navBarBottomOffset + 90,
          },
        ]}
      >
        <TopBar logo onMenuPress={onMenuPress} onCartPress={onCartPress} />

        <View style={styles.card}>
          <View style={styles.identityRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
            </View>
            <Text style={styles.customerName} numberOfLines={1}>
              {customer.name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{customer.phone}</Text>
            <ChangeIcon label="Change phone" />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {customer.email}
            </Text>
            <ChangeIcon label="Change email" />
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <Text style={styles.fieldValue}>{customer.dateOfBirth}</Text>

          <Text style={[styles.fieldLabel, styles.fieldGap]}>Full Address</Text>
          <Text style={styles.fieldValue}>{customer.addressLine1}</Text>
          <Text style={styles.fieldValue}>{customer.addressLine2}</Text>

          <View style={styles.triple}>
            <View style={styles.tripleCol}>
              <Text style={styles.fieldLabel}>District</Text>
              <Text style={styles.fieldValue}>{customer.district}</Text>
            </View>
            <View style={styles.tripleCol}>
              <Text style={styles.fieldLabel}>State</Text>
              <Text style={styles.fieldValue}>{customer.state}</Text>
            </View>
            <View style={styles.tripleCol}>
              <Text style={styles.fieldLabel}>PIN Code</Text>
              <Text style={styles.fieldValue}>{customer.pin}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.companyCard]}>
          <View style={styles.companyHeader}>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.sectionTitle}>Company Details</Text>
          </View>

          <View style={styles.socialRow}>
            <Text style={styles.followLabel}>Follow Us</Text>
            {socials.map(s => (
              <View key={s.key} style={styles.socialItem}>
                <Image
                  source={s.icon}
                  style={styles.socialIcon}
                  accessibilityLabel={s.label}
                />
                <Text style={styles.socialLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.websiteButton}
            onPress={() => Linking.openURL(company.websiteUrl)}
          >
            <Text style={styles.contactIcon}>{'\u{1F310}'}</Text>
            <Text style={styles.link}>{company.website}</Text>
          </Pressable>

          <View style={styles.contactGroup}>
            <Pressable
              style={styles.contactRow}
              onPress={() => Linking.openURL('tel:' + company.phone)}
            >
              <Text style={styles.contactIcon}>{'\u{1F4DE}'}</Text>
              <Text style={styles.contactText}>{company.phone}</Text>
            </Pressable>
            <View style={styles.contactDivider} />
            <Pressable
              style={styles.contactRow}
              onPress={() => Linking.openURL('mailto:' + company.email)}
            >
              <Text style={styles.contactIcon}>{'✉️'}</Text>
              <Text style={styles.contactText}>{company.email}</Text>
            </Pressable>
            <View style={styles.contactDivider} />
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>{'\u{1F4CD}'}</Text>
              <View>
                {company.addressLines.map(line => (
                  <Text key={line} style={styles.contactText}>
                    {line}
                  </Text>
                ))}
              </View>
            </View>
          </View>
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
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  companyCard: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primaryTint,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  customerName: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: colors.heading,
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
  },
  infoLabel: {
    width: 56,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.heading,
  },
  changeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIconText: {
    fontSize: 14,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 1,
  },
  fieldGap: {
    marginTop: 8,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.heading,
  },
  triple: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  tripleCol: {
    flex: 1,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  companyName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
    marginBottom: 10,
  },
  followLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 4,
  },
  socialItem: {
    alignItems: 'center',
  },
  socialIcon: {
    width: 34,
    height: 34,
  },
  socialLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  contactGroup: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  contactIcon: {
    fontSize: 16,
    width: 28,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.heading,
  },
});
