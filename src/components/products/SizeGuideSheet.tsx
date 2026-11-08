import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { displayFont } from '../../theme/typography';
import { fitNotes, measureTips, sizeChart } from '../../data/sizeGuide';

type SizeGuideSheetProps = {
  visible: boolean;
  onClose: () => void;
  // Highlights this row when the shopper has already picked a size.
  selectedSize?: string | null;
};

const COLUMNS: { key: 'size' | 'bust' | 'waist' | 'hip' | 'length'; label: string }[] = [
  { key: 'size', label: 'Size' },
  { key: 'bust', label: 'Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'hip', label: 'Hip' },
  { key: 'length', label: 'Length' },
];

export default function SizeGuideSheet({ visible, onClose, selectedSize }: SizeGuideSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Size guide</Text>
          <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close size guide">
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sub}>Body measurements in inches</Text>
          <View style={styles.table}>
            <View style={[styles.row, styles.headRow]}>
              {COLUMNS.map(col => (
                <Text key={col.key} style={[styles.cell, styles.headCell]}>
                  {col.label}
                </Text>
              ))}
            </View>
            {sizeChart.map(row => (
              <View
                key={row.size}
                style={[styles.row, row.size === selectedSize && styles.rowActive]}
              >
                {COLUMNS.map(col => (
                  <Text
                    key={col.key}
                    style={[styles.cell, col.key === 'size' && styles.sizeCell]}
                  >
                    {row[col.key]}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          <Text style={styles.heading}>How to measure</Text>
          {measureTips.map(tip => (
            <Text key={tip.title} style={styles.tip}>
              <Text style={styles.tipTitle}>{tip.title}: </Text>
              {tip.body}
            </Text>
          ))}

          <Text style={styles.heading}>Fit notes</Text>
          {fitNotes.map(note => (
            <Text key={note} style={styles.tip}>
              •  {note}
            </Text>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(35,27,46,0.45)' },
  sheet: {
    maxHeight: '82%',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: displayFont, fontSize: 22, fontWeight: '700', color: colors.heading },
  close: { fontSize: 20, color: colors.textSecondary },
  sub: { marginTop: 4, marginBottom: 12, fontSize: 12, color: colors.textSecondary },
  table: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headRow: { backgroundColor: colors.primaryTint },
  rowActive: { backgroundColor: colors.primaryTint },
  cell: { flex: 1, paddingVertical: 10, textAlign: 'center', fontSize: 13, color: colors.heading },
  headCell: { fontWeight: '700', color: colors.primary },
  sizeCell: { fontWeight: '800' },
  heading: { marginTop: 18, marginBottom: 6, fontSize: 15, fontWeight: '700', color: colors.heading },
  tip: { marginBottom: 6, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  tipTitle: { fontWeight: '700', color: colors.heading },
});
