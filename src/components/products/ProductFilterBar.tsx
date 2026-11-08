import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type ProductFilterBarProps = {
  activeFilterCount?: number;
  sortLabel?: string;
  onFilterPress?: () => void;
  onSortPress?: () => void;
};

export default function ProductFilterBar({
  activeFilterCount = 0,
  sortLabel,
  onFilterPress,
  onSortPress,
}: ProductFilterBarProps) {
  const filterActive = activeFilterCount > 0;
  const sortActive = Boolean(sortLabel);

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.control, filterActive && styles.controlActive]}
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel="Filter products"
      >
        <Text style={[styles.label, filterActive && styles.labelActive]}>
          {filterActive ? `Filter (${activeFilterCount})` : 'Filter'}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.control, styles.controlLast, sortActive && styles.controlActive]}
        onPress={onSortPress}
        accessibilityRole="button"
        accessibilityLabel="Sort products"
      >
        <Text
          style={[styles.label, sortActive && styles.labelActive]}
          numberOfLines={1}
        >
          {sortLabel ?? 'Sort'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  control: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlLast: {
    marginRight: 0,
  },
  controlActive: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
  },
  labelActive: {
    color: colors.primary,
  },
});
