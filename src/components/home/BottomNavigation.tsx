import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export type BottomNavItem = {
  key: string;
  label: string;
};

const navItems: BottomNavItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'products', label: 'Products' },
  { key: 'game', label: 'Game' },
  { key: 'rewards', label: 'Rewards' },
  { key: 'profile', label: 'Profile' },
];

const ICON_SIZE = 22;
const STROKE = 1.8;

type NavIconProps = {
  name: string;
  color: string;
  filled: boolean;
};

// Outline icons drawn from plain Views, so no icon library or rebuild is
// needed. `filled` solidifies the main shape for the active tab.
function NavIcon({ name, color, filled }: NavIconProps) {
  const fill = filled ? color : 'transparent';
  const outline = { borderColor: color, borderWidth: STROKE };

  switch (name) {
    case 'home':
      return (
        <View style={styles.iconBox}>
          <View
            style={[
              styles.roof,
              { borderBottomColor: color },
              !filled && styles.roofHollow,
            ]}
          />
          <View style={[styles.houseBody, outline, { backgroundColor: fill }]}>
            <View
              style={[
                styles.door,
                { backgroundColor: filled ? colors.surface : color },
              ]}
            />
          </View>
        </View>
      );
    case 'products':
      return (
        <View style={[styles.iconBox, styles.gridBox]}>
          {[0, 1, 2, 3].map(index => (
            <View
              key={index}
              style={[styles.gridCell, outline, { backgroundColor: fill }]}
            />
          ))}
        </View>
      );
    case 'game':
      return (
        <View style={styles.iconBox}>
          <View style={[styles.pad, outline, { backgroundColor: fill }]}>
            <View
              style={[
                styles.padDot,
                { backgroundColor: filled ? colors.surface : color },
              ]}
            />
            <View
              style={[
                styles.padDot,
                { backgroundColor: filled ? colors.surface : color },
              ]}
            />
          </View>
        </View>
      );
    case 'rewards':
      return (
        <View style={styles.iconBox}>
          <View style={[styles.giftBody, outline, { backgroundColor: fill }]}>
            <View
              style={[
                styles.ribbonV,
                { backgroundColor: filled ? colors.surface : color },
              ]}
            />
          </View>
          <View style={[styles.giftLid, outline, { backgroundColor: fill }]} />
        </View>
      );
    default:
      return (
        <View style={styles.iconBox}>
          <View style={[styles.head, outline, { backgroundColor: fill }]} />
          <View style={[styles.shoulders, outline, { backgroundColor: fill }]} />
        </View>
      );
  }
}

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
          const color = isActive ? colors.primary : colors.textSecondary;
          return (
            <Pressable
              key={item.key}
              style={styles.item}
              onPress={() => onChange?.(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={item.label}
            >
              <View style={[styles.pill, isActive && styles.pillActive]}>
                <NavIcon name={item.key} color={color} filled={isActive} />
              </View>
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
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 520,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    width: 52,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  pillActive: {
    backgroundColor: colors.primaryTint,
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
  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  roofHollow: {
    opacity: 0.85,
  },
  houseBody: {
    width: 16,
    height: 11,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  door: {
    width: 4,
    height: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  gridBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    justifyContent: 'space-between',
  },
  gridCell: {
    width: 9.5,
    height: 9.5,
    borderRadius: 3,
  },
  pad: {
    width: 22,
    height: 14,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 3,
  },
  padDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  giftBody: {
    width: 18,
    height: 12,
    marginTop: 6,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
  },
  ribbonV: {
    width: 2.5,
    height: '100%',
  },
  giftLid: {
    position: 'absolute',
    top: 3,
    width: 22,
    height: 6,
    borderRadius: 2,
  },
  head: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginBottom: 2,
  },
  shoulders: {
    width: 18,
    height: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomWidth: 0,
  },
});
