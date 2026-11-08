import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import SubScreen from '../components/common/SubScreen';
import { company } from '../data/company';

type CompanyDetailsScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
};

const socials = [
  { key: 'instagram', label: 'Instagram', icon: require('../assets/social/instagram.png'), url: company.instagramUrl },
  { key: 'facebook', label: 'Facebook', icon: require('../assets/social/facebook.png'), url: company.facebookUrl },
  { key: 'whatsapp', label: 'WhatsApp', icon: require('../assets/social/whatsapp.png'), url: company.whatsappUrl },
];

type RowProps = { glyph: string; text: string; onPress: () => void };

function Row({ glyph, text, onPress }: RowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.glyph}>{glyph}</Text>
      <Text style={styles.rowText}>{text}</Text>
    </Pressable>
  );
}

export default function CompanyDetailsScreen({
  onBack,
  onCartPress,
}: CompanyDetailsScreenProps) {
  return (
    <SubScreen title="Company details" onBack={onBack} onCartPress={onCartPress}>
      <Text style={styles.name}>{company.name}</Text>
      <Text style={styles.tagline}>{company.tagline}</Text>

      <View style={styles.card}>
        <Row glyph="◎" text={company.website} onPress={() => Linking.openURL(company.websiteUrl)} />
        <Row glyph="✆" text={company.phone} onPress={() => Linking.openURL(`tel:${company.phone}`)} />
        <Row glyph="✉" text={company.email} onPress={() => Linking.openURL(`mailto:${company.email}`)} />
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.glyph}>⌂</Text>
          <Text style={styles.rowText}>{company.addressLines.join('\n')}</Text>
        </View>
      </View>

      <Text style={styles.section}>Follow us</Text>
      <View style={styles.socialRow}>
        {socials.map(item => (
          <Pressable
            key={item.key}
            style={styles.social}
            onPress={() => Linking.openURL(item.url)}
            accessibilityLabel={item.label}
          >
            <Image source={item.icon} style={styles.socialIcon} />
            <Text style={styles.socialLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  name: {
    fontFamily: displayFont,
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  tagline: {
    marginTop: 2,
    marginBottom: 18,
    fontSize: 13,
    color: colors.textSecondary,
  },
  card: {
    paddingHorizontal: 16,
    borderRadius: 18,
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
  glyph: {
    width: 24,
    textAlign: 'center',
    fontSize: 18,
    color: colors.primary,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.heading,
  },
  section: {
    marginTop: 26,
    marginBottom: 12,
    fontFamily: displayFont,
    fontSize: 18,
    fontWeight: '700',
    color: colors.heading,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 22,
  },
  social: {
    alignItems: 'center',
    gap: 6,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  socialLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
