import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import SubScreen from '../components/common/SubScreen';
import { company } from '../data/company';

type HelpScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
  onOpenPolicy: () => void;
};

// Placeholder answers: replace with the approved support wording.
const FAQS: { q: string; a: string }[] = [
  { q: 'How long does delivery take?', a: 'Most orders arrive in 3 to 5 working days. You can see the date before you pay.' },
  { q: 'Can I change or cancel my order?', a: 'Yes, until it is shipped. Open the order in My orders and tap Cancel order.' },
  { q: 'How do returns and exchanges work?', a: 'Within 7 days of delivery, open the delivered order and tap Return or exchange items.' },
  { q: 'Is cash on delivery available?', a: 'Yes. Choose Cash on delivery at checkout.' },
  { q: 'Which size should I pick?', a: 'Use the Size guide on any product page. Between two sizes, go one size up.' },
];

const open = (url: string) => {
  Linking.openURL(url).catch(() => undefined);
};

export default function HelpScreen({ onBack, onCartPress, onOpenPolicy }: HelpScreenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SubScreen title="Help and support" onBack={onBack} onCartPress={onCartPress}>
      <View style={styles.actions}>
        <Pressable style={[styles.action, styles.whatsapp]} onPress={() => open(company.whatsappUrl)}>
          <Text style={styles.actionTitle}>Chat on WhatsApp</Text>
          <Text style={styles.actionSub}>Replies within a few hours</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => open(`tel:+91${company.phone}`)}>
          <Text style={[styles.actionTitle, styles.dark]}>Call us</Text>
          <Text style={[styles.actionSub, styles.darkSub]}>+91 {company.phone}</Text>
        </Pressable>
      </View>
      <Pressable onPress={() => open(`mailto:${company.email}`)}>
        <Text style={styles.link}>Or email {company.email} ›</Text>
      </Pressable>

      <Text style={styles.heading}>Common questions</Text>
      {FAQS.map((item, index) => {
        const expanded = openIndex === index;
        return (
          <Pressable
            key={item.q}
            style={styles.faq}
            onPress={() => setOpenIndex(expanded ? null : index)}
          >
            <View style={styles.faqHead}>
              <Text style={styles.faqQ}>{item.q}</Text>
              <Text style={styles.chevron}>{expanded ? '⌃' : '⌄'}</Text>
            </View>
            {expanded && <Text style={styles.faqA}>{item.a}</Text>}
          </Pressable>
        );
      })}

      <Pressable onPress={onOpenPolicy}>
        <Text style={styles.link}>Returns and exchange policy ›</Text>
      </Pressable>
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 10 },
  action: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  whatsapp: { backgroundColor: colors.primary, borderColor: colors.primary },
  actionTitle: { fontSize: 15, fontWeight: '800', color: colors.white },
  actionSub: { marginTop: 4, fontSize: 12, color: colors.white },
  dark: { color: colors.heading },
  darkSub: { color: colors.textSecondary },
  link: { marginTop: 14, fontSize: 13, fontWeight: '700', color: colors.primary },
  heading: { marginTop: 22, marginBottom: 10, fontSize: 17, fontWeight: '700', color: colors.heading },
  faq: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  faqHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.heading },
  chevron: { fontSize: 16, color: colors.textSecondary },
  faqA: { marginTop: 8, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
});
