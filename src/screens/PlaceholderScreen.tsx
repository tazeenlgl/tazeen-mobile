import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';

type PlaceholderScreenProps = {
  title: string;
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onBack: () => void;
  onCartPress: () => void;
};

export default function PlaceholderScreen({
  title,
  drawerOpen,
  onMenuPress,
  onDrawerClose,
  onBack,
  onCartPress,
}: PlaceholderScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.flex, { paddingTop: insets.top + 10 }]}>
      <TopBar title={title} onMenuPress={onMenuPress} onBack={onBack} onCartPress={onCartPress} />
      <Text style={styles.note}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  note: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
