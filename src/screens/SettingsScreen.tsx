import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';

type SettingsScreenProps = {
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onNavigate?: (key: string) => void;
  onCartPress: () => void;
  onBack?: () => void;
};

export default function SettingsScreen({
  drawerOpen,
  onMenuPress,
  onDrawerClose,
  onNavigate,
  onCartPress,
  onBack,
}: SettingsScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View style={styles.content}>
          <TopBar
            title="Settings"
            onMenuPress={onMenuPress}
            onBack={onBack}
            onCartPress={onCartPress}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Pressable
              style={styles.settingItem}
              onPress={() => onNavigate?.('changepin')}
            >
              <Text style={styles.settingLabel}>Change PIN</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <Pressable
              style={styles.settingItem}
              onPress={() => onNavigate?.('termsofuse')}
            >
              <Text style={styles.settingLabel}>Terms of Use</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              style={styles.settingItem}
              onPress={() => onNavigate?.('privacypolicy')}
            >
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.heading,
  },
  settingArrow: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 0,
  },
});
