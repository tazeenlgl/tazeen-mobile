import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';

type PrivacyPolicyScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
};

export default function PrivacyPolicyScreen({
  onBack,
  onCartPress,
}: PrivacyPolicyScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View style={styles.content}>
          <TopBar title="Privacy Policy" onBack={onBack} onCartPress={onCartPress} />

          <Section title="Information We Collect">
            We collect information you provide directly to us, such as: phone
            number, PIN/password, name, email address, delivery address, payment
            information, and device identifiers. We also collect information
            about your interactions with the App, including purchases, rewards
            redemptions, game participation, and app usage patterns.
          </Section>

          <Section title="How Information Is Used">
            We use your information to: process transactions, provide customer
            support, send notifications about orders and rewards, personalize
            your experience, improve the App, conduct analytics, and comply with
            legal obligations.
          </Section>

          <Section title="Account Information">
            Your phone number and PIN are used to authenticate your account and
            secure your personal data. We strongly recommend using a secure PIN
            and keeping it confidential.
          </Section>

          <Section title="Orders and Transactions">
            Order information, including items purchased, delivery address, and
            payment details, is collected and stored to fulfill your orders,
            process refunds, and provide customer service.
          </Section>

          <Section title="Rewards, Gift Cards, Coupons, and Points">
            We track your rewards points, gift card balances, coupon usage, and
            promotion participation to manage your account and provide you with
            personalized offers.
          </Section>

          <Section title="Device and App Information">
            We collect technical information about your device, including device
            type, operating system, app version, and usage analytics. This helps
            us optimize the App's performance and user experience.
          </Section>

          <Section title="Sharing of Information">
            We do not sell your personal information. We may share information
            with trusted service providers who assist us in operating the App
            and processing payments. We may also disclose information if required
            by law or to protect our rights and safety.
          </Section>

          <Section title="Data Security">
            We implement industry-standard security measures to protect your
            information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet or
            electronic storage is 100% secure.
          </Section>

          <Section title="Data Retention">
            We retain your personal information for as long as necessary to
            provide our services and comply with legal obligations. You may
            request deletion of your account and associated data at any time.
          </Section>

          <Section title="Your Rights">
            You have the right to access, correct, or delete your personal
            information. You may also request that we limit how we use your
            information or opt out of promotional communications.
          </Section>

          <Section title="Contact Information">
            For privacy inquiries or to exercise your rights, please contact us
            at:{' '}
            <Text style={styles.placeholder}>[support@tazeen.com - PLACEHOLDER]</Text>
          </Section>

          <Text style={styles.lastUpdated}>
            Last Updated: October 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{children}</Text>
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
  sectionText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  placeholder: {
    color: colors.primary,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 11,
    color: colors.placeholder,
    marginTop: 16,
  },
});
