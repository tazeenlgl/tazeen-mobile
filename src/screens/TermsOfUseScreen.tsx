import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';

type TermsOfUseScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
};

export default function TermsOfUseScreen({
  onBack,
  onCartPress,
}: TermsOfUseScreenProps) {
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
          <TopBar title="Terms of Use" onBack={onBack} onCartPress={onCartPress} />

          <Section title="Acceptance of Terms">
            By accessing and using the Tazeen mobile application (the "App"),
            you accept and agree to be bound by the terms and provision of this
            agreement. If you do not agree to abide by the above, please do not
            use this service.
          </Section>

          <Section title="Account Registration">
            You are responsible for maintaining the confidentiality of your
            account information, including your PIN. You agree to accept
            responsibility for all activities that occur under your account.
            You must notify Tazeen immediately of any unauthorized use of your
            account.
          </Section>

          <Section title="Shopping and Orders">
            Tazeen reserves the right to refuse or cancel any order. All prices
            are subject to change without notice. Product availability is
            limited and subject to verification and acceptance of your order.
          </Section>

          <Section title="Payment Processing">
            You agree to provide accurate billing information. All payments are
            processed securely. Refunds are subject to our return policy and
            will be issued within 7-10 business days.
          </Section>

          <Section title="Gift Cards and Coupons">
            Gift cards are non-refundable and cannot be exchanged for cash.
            Coupons are valid only during the specified promotion period. Terms
            and conditions apply to all promotional offers.
          </Section>

          <Section title="Rewards Program">
            The Tazeen Rewards program is available to registered users. Points
            are earned on eligible purchases and may be redeemed for discounts
            or rewards. Rewards points have no cash value and cannot be
            transferred.
          </Section>

          <Section title="Game Participation">
            Games are for entertainment purposes only and subject to official
            rules. By participating, you agree to follow all game guidelines and
            accept the results as final. Rewards are non-exchangeable for cash.
          </Section>

          <Section title="Prohibited Use">
            You agree not to use the App to: violate any applicable laws,
            harass or harm others, transmit malware, or engage in fraudulent
            activities. Tazeen reserves the right to terminate accounts that
            violate these terms.
          </Section>

          <Section title="Modifications to Terms">
            Tazeen reserves the right to modify these terms at any time. Your
            continued use of the App following such modifications constitutes
            your acceptance of the updated terms.
          </Section>

          <Section title="Termination of Account">
            Tazeen may terminate or suspend your account and access to the App
            at any time without notice, at our sole discretion, for conduct that
            we believe violates these terms.
          </Section>

          <Section title="Contact Information">
            For questions regarding these Terms of Use, please contact us at:{' '}
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
