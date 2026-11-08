import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import SubScreen from '../components/common/SubScreen';
import { RETURN_WINDOW_DAYS } from '../utils/pricing';

type ReturnPolicyScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
};

// Placeholder policy text: replace with the approved wording from Tazeen.
const SECTIONS: { title: string; body: string }[] = [
  {
    title: `${RETURN_WINDOW_DAYS}-day returns`,
    body: `You can return an item within ${RETURN_WINDOW_DAYS} days of delivery if it is unworn, unwashed and has its tags and packaging.`,
  },
  {
    title: 'Size exchanges',
    body: 'Not the right fit? Exchange for another size, subject to stock. We collect the original item when delivering the new one.',
  },
  {
    title: 'What cannot be returned',
    body: 'Customised or stitched-to-measure pieces, innerwear, and items marked final sale.',
  },
  {
    title: 'Refunds',
    body: 'Refunds go back to your original payment method within 5 to 7 working days of us receiving the item. Cash on delivery refunds are sent to your bank or UPI.',
  },
  {
    title: 'Damaged or wrong item',
    body: 'Tell us within 48 hours of delivery and we will arrange a free pickup and replacement or refund.',
  },
];

export default function ReturnPolicyScreen({ onBack, onCartPress }: ReturnPolicyScreenProps) {
  return (
    <SubScreen title="Returns policy" onBack={onBack} onCartPress={onCartPress}>
      {SECTIONS.map(section => (
        <View key={section.title} style={styles.card}>
          <Text style={styles.title}>{section.title}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: { fontSize: 15, fontWeight: '700', color: colors.heading },
  body: { marginTop: 6, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
});
