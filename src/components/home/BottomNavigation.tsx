import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export type BottomNavItem = {
  key: string;
  label: string;
  icon: string;
};

const navItems: BottomNavItem[] = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'products', label: 'Products', icon: '▦' },
  { key: 'game', label: 'Game', icon: '◆' },
  { key: 'rewards', label: 'Rewards', icon: '★' },
  { key: 'profile', label: 'Profile', icon: '●' },
];

type BottomNavigationProps = {
  activeKey: string;
  onChange?: (key: string) => void;
  bottomOffset: number;
};

export default function BottomNavigation({
  activeKey,
  onChange,
  bottomOffset,
}: BottomNavigationProps) {
  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      <View style={styles.bar}>
        {navItems.map(item => {
          const isActive = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              style={styles.item}
              onPress={() => onChange?.(item.key)}
            >
              <Text
                style={[styles.icon, isActive && styles.iconActive]}
              >
                {item.icon}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.label, isActive && styles.labelActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 28,
    paddingVertical: 10,
    shadowColor: colors.heading,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  iconActive: {
    color: colors.primary,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
