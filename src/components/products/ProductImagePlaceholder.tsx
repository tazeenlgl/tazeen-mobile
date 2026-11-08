import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

type ProductImagePlaceholderProps = {
  tint: string;
  label?: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

// Shown wherever a product has no real photo yet. Keeps the tinted block
// but adds a mark so it reads as "photo coming soon", not a rendering bug.
export default function ProductImagePlaceholder({
  tint,
  label = 'Photo coming soon',
  compact = false,
  style,
  children,
}: ProductImagePlaceholderProps) {
  return (
    <View
      style={[styles.base, { backgroundColor: tint }, style]}
      accessibilityLabel="Product photo not available yet"
    >
      <View style={[styles.mark, compact && styles.markCompact]}>
        <Text style={[styles.markGlyph, compact && styles.markGlyphCompact]}>
          T
        </Text>
      </View>
      {!compact && <Text style={styles.label}>{label}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  markCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  markGlyph: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  markGlyphCompact: {
    fontSize: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    color: colors.primaryDark,
    opacity: 0.7,
  },
});
