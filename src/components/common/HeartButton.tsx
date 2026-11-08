import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { useWishlist } from '../../context/WishlistContext';

type HeartButtonProps = {
  productId: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

// Round heart toggle used on product cards and Product Details.
export default function HeartButton({ productId, size = 34, style }: HeartButtonProps) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);

  return (
    <Pressable
      hitSlop={6}
      onPress={() => toggle(productId)}
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.heart, { fontSize: size * 0.55 }, saved && styles.heartSaved]}>
        {saved ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heart: { color: colors.heading, includeFontPadding: false },
  heartSaved: { color: colors.primary },
});
