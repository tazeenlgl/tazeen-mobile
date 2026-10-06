import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import CartButton from './CartButton';

type TopBarProps = {
  // Renders the Tazeen wordmark instead of a plain title (used on Home).
  logo?: boolean;
  title?: string;
  onBack?: () => void;
  onMenuPress?: () => void;
  onCartPress: () => void;
  rightAccessory?: React.ReactNode;
};

export default function TopBar({
  logo,
  title,
  onBack,
  onMenuPress,
  onCartPress,
  rightAccessory,
}: TopBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {onMenuPress && (
          <Pressable
            style={styles.menuButton}
            onPress={onMenuPress}
            accessibilityLabel="Open menu"
          >
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
        )}
        {onBack && (
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>{'‹'}</Text>
          </Pressable>
        )}
        {logo ? (
          <Text style={styles.logo}>Tazeen</Text>
        ) : title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>
        {rightAccessory}
        <CartButton onPress={onCartPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  menuButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginLeft: -6,
  },
  menuIcon: {
    fontSize: 22,
    color: colors.heading,
  },
  backIcon: {
    fontSize: 24,
    color: colors.heading,
  },
  logo: {
    ...typography.logo,
    color: colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.heading,
    flexShrink: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
