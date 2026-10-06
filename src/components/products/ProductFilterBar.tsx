import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type ProductFilterBarProps = {
  onFilterPress?: () => void;
  onSortPress?: () => void;
};

export default function ProductFilterBar({
  onFilterPress,
  onSortPress,
}: ProductFilterBarProps) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.control} onPress={onFilterPress}>
        <Text style={styles.label}>Filter</Text>
      </Pressable>
      <Pressable style={styles.control} onPress={onSortPress}>
        <Text style={styles.label}>Sort</Text>
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
  },
});
