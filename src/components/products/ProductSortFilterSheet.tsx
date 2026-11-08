import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { SORT_OPTIONS } from '../../utils/productFilters';
import type { SortKey } from '../../utils/productFilters';

export type SheetMode = 'sort' | 'filter';

type ProductSortFilterSheetProps = {
  mode: SheetMode | null;
  sort: SortKey;
  sizes: string[];
  availableSizes: string[];
  inStockOnly: boolean;
  onSortChange: (sort: SortKey) => void;
  onToggleSize: (size: string) => void;
  onInStockChange: (value: boolean) => void;
  onClear: () => void;
  onClose: () => void;
};

export default function ProductSortFilterSheet({
  mode,
  sort,
  sizes,
  availableSizes,
  inStockOnly,
  onSortChange,
  onToggleSize,
  onInStockChange,
  onClear,
  onClose,
}: ProductSortFilterSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={mode !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            {mode === 'sort' ? 'Sort by' : 'Filter'}
          </Text>
          {mode === 'filter' && (
            <Pressable onPress={onClear} hitSlop={10}>
              <Text style={styles.clear}>Clear all</Text>
            </Pressable>
          )}
        </View>

        {mode === 'sort' && (
          <View>
            {SORT_OPTIONS.map(option => {
              const active = option.key === sort;
              return (
                <Pressable
                  key={option.key}
                  style={styles.optionRow}
                  onPress={() => {
                    onSortChange(option.key);
                    onClose();
                  }}
                >
                  <Text style={[styles.optionText, active && styles.optionActive]}>
                    {option.label}
                  </Text>
                  {active && <Text style={styles.tick}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        )}

        {mode === 'filter' && (
          <ScrollView style={styles.filterBody}>
            <Text style={styles.groupLabel}>Size</Text>
            <View style={styles.chipRow}>
              {availableSizes.map(size => {
                const active = sizes.includes(size);
                return (
                  <Pressable
                    key={size}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => onToggleSize(size)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {size}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.optionRow}
              onPress={() => onInStockChange(!inStockOnly)}
            >
              <Text style={styles.optionText}>In stock only</Text>
              <View style={[styles.checkbox, inStockOnly && styles.checkboxActive]}>
                {inStockOnly && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
            </Pressable>

            <Pressable style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyText}>Show results</Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '75%',
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.heading,
  },
  clear: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 15,
    color: colors.heading,
  },
  optionActive: {
    fontWeight: '700',
    color: colors.primary,
  },
  tick: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  filterBody: {
    flexGrow: 0,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    minWidth: 52,
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.heading,
  },
  chipTextActive: {
    color: colors.white,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxTick: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  applyButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
