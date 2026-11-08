import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type SizeSelectorProps = {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  showError?: boolean;
  onOpenGuide?: () => void;
};

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  showError = false,
  onOpenGuide,
}: SizeSelectorProps) {
  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Select Size</Text>
        {onOpenGuide ? (
          <Pressable onPress={onOpenGuide} hitSlop={8}>
            <Text style={styles.guideLink}>Size guide ›</Text>
          </Pressable>
        ) : null}
      </View>
      {sizes.length === 0 ? (
        <View style={[styles.chip, styles.chipActive]}>
          <Text style={[styles.chipLabel, styles.chipLabelActive]}>
            One Size
          </Text>
        </View>
      ) : (
        <View style={styles.row}>
          {sizes.map(size => {
            const isActive = size === selectedSize;
            return (
              <Pressable
                key={size}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onSelect(size)}
              >
                <Text
                  style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                >
                  {size}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
      {showError && (
        <Text style={styles.error}>Please select a size to continue</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  guideLink: { fontSize: 13, fontWeight: '700', color: colors.primary },
  error: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#B3261E',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    minWidth: 44,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
  },
  chipLabelActive: {
    color: colors.white,
  },
});
