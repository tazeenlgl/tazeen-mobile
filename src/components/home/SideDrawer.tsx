import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

type DrawerItem = { key: string; label: string; icon: string };

const DRAWER_WIDTH = Math.round(Dimensions.get('window').width * 0.8);

const getMenuItems = (isLoggedIn: boolean): DrawerItem[] => {
  const authItem = isLoggedIn
    ? { key: 'logout', label: 'Logout', icon: '→' }
    : { key: 'login', label: 'Login', icon: '→' };

  return [
    { key: 'orders', label: 'Orders', icon: '▤' },
    { key: 'settings', label: 'Settings', icon: '⚙' },
    authItem,
    { key: 'termsofuse', label: 'Terms of Use', icon: '📄' },
    { key: 'privacypolicy', label: 'Privacy Policy', icon: '🔒' },
  ];
};

type SideDrawerProps = {
  visible: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
};

export default function SideDrawer({
  visible,
  isLoggedIn,
  onClose,
  onSelect,
}: SideDrawerProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  const items = getMenuItems(isLoggedIn);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) {
        setMounted(false);
      }
    });
  }, [visible, progress]);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onClose();
        return true;
      },
    );
    return () => subscription.remove();
  }, [visible, onClose]);

  if (!mounted) {
    return null;
  }

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, { opacity: progress }]}>
        <Pressable style={styles.flex} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
            transform: [{ translateX }],
          },
        ]}
      >
        <Text style={styles.brand}>Tazeen</Text>
        <Text style={styles.tagline}>Fashion for Every You</Text>

        <View style={styles.divider} />

        {items.map(item => (
          <Pressable
            key={item.key}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            onPress={() => onSelect(item.key)}
          >
            {({ pressed }) => (
              <>
                <Text style={[styles.itemIcon, pressed && styles.itemTextActive]}>
                  {item.icon}
                </Text>
                <Text style={[styles.itemLabel, pressed && styles.itemTextActive]}>
                  {item.label}
                </Text>
              </>
            )}
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
    elevation: 20,
  },
  flex: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.glassDark,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.surface,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    shadowColor: colors.heading,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 4, height: 0 },
    elevation: 24,
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  itemPressed: {
    backgroundColor: colors.primaryTint,
  },
  itemIcon: {
    width: 28,
    fontSize: 18,
    color: colors.textSecondary,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.heading,
  },
  itemTextActive: {
    color: colors.primary,
  },
});
