import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import type { ProductCategory } from '../../data/productCategories';

type CategoryFilterProps = {
  categories: ProductCategory[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
};

export default function CategoryFilter({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map(category => {
        const isActive = category.id === activeCategoryId;
        return (
          <Pressable
            key={category.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(category.id)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.white,
  },
});
