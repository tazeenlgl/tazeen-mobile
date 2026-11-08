import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';
import SubScreen from '../components/common/SubScreen';
import { company } from '../data/company';

type AboutTazeenScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
  onOpenCompany: () => void;
};

// Placeholder copy: replace with the confirmed brand story.
const promises = [
  { glyph: '✂', title: 'Quality fabric', body: 'Soft, breathable cloth chosen for everyday comfort.' },
  { glyph: '➤', title: 'Fast delivery', body: 'Carefully packed and sent to your door.' },
  { glyph: '↺', title: 'Easy returns', body: 'Not the right fit? We make exchanges simple.' },
];

export default function AboutTazeenScreen({
  onBack,
  onCartPress,
  onOpenCompany,
}: AboutTazeenScreenProps) {
  return (
    <SubScreen title="About Tazeen" onBack={onBack} onCartPress={onCartPress}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>LALGOLA, MURSHIDABAD</Text>
        <Text style={styles.heroTitle}>Everyday elegance, stitched with care</Text>
      </View>

      <Text style={styles.story}>
        {company.name} brings graceful suits, kurtis and everyday wear from our
        home town to yours. We believe good clothes should feel special without
        feeling out of reach, so every piece is chosen for its fit, fabric and
        finish.
      </Text>

      <Text style={styles.section}>Our promise</Text>
      {promises.map(item => (
        <View key={item.title} style={styles.promise}>
          <View style={styles.promiseIcon}>
            <Text style={styles.promiseGlyph}>{item.glyph}</Text>
          </View>
          <View style={styles.promiseText}>
            <Text style={styles.promiseTitle}>{item.title}</Text>
            <Text style={styles.promiseBody}>{item.body}</Text>
          </View>
        </View>
      ))}

      <Pressable style={styles.linkCard} onPress={onOpenCompany}>
        <View style={styles.promiseText}>
          <Text style={styles.promiseTitle}>Company details</Text>
          <Text style={styles.promiseBody}>
            Contact, address and social links
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#E9DCEE',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: colors.primary,
  },
  heroTitle: {
    marginTop: 8,
    fontFamily: displayFont,
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '700',
    color: colors.heading,
  },
  story: {
    marginTop: 18,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  section: {
    marginTop: 26,
    marginBottom: 12,
    fontFamily: displayFont,
    fontSize: 19,
    fontWeight: '700',
    color: colors.heading,
  },
  promise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  promiseIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
  },
  promiseGlyph: {
    fontSize: 18,
    color: colors.primary,
  },
  promiseText: {
    flex: 1,
  },
  promiseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
  },
  promiseBody: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
  },
  chevron: {
    fontSize: 26,
    color: colors.primary,
  },
});
