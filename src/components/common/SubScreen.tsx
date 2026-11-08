import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import TopBar from './TopBar';

type SubScreenProps = {
  title: string;
  onBack: () => void;
  onCartPress: () => void;
  // Pinned under the scrolling content, e.g. a primary action button.
  footer?: React.ReactNode;
  children: React.ReactNode;
};

// Shared shell for pushed screens: safe-area top bar, scrolling body,
// optional pinned footer, content capped for tablets.
export default function SubScreen({
  title,
  onBack,
  onCartPress,
  footer,
  children,
}: SubScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 10,
            paddingBottom: (footer ? 110 : 32) + insets.bottom,
          },
        ]}
      >
        <TopBar title={title} onBack={onBack} onCartPress={onCartPress} />
        <View style={styles.body}>{children}</View>
      </ScrollView>
      {footer ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
          <View style={styles.footerInner}>{footer}</View>
        </View>
      ) : null}
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
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  body: {
    marginTop: 18,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerInner: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
});
