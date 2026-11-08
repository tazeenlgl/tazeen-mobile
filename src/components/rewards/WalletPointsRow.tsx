import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

type WalletPointsRowProps = {
  walletBalance: number;
  pointsBalance: number;
  onTransactionHistory?: () => void;
  onPointsHistory?: () => void;
};

export default function WalletPointsRow({
  walletBalance,
  pointsBalance,
  onTransactionHistory,
  onPointsHistory,
}: WalletPointsRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.card, styles.walletCard]}>
        <View style={styles.cardTop}>
          <View style={[styles.iconBubble, styles.walletIconBubble]}>
            <Text style={styles.icon}>👛</Text>
          </View>
          <Text style={styles.label}>Wallet Balance</Text>
          <Text style={styles.value}>{formatRupees(walletBalance)}</Text>
        </View>
        <Pressable style={styles.historyRow} onPress={onTransactionHistory}>
          <Text style={styles.historyText}>Transaction History</Text>
          <Text style={styles.historyChevron}>›</Text>
        </Pressable>
      </View>

      <View style={[styles.card, styles.pointsCard]}>
        <View style={styles.cardTop}>
          <View style={[styles.iconBubble, styles.pointsIconBubble]}>
            <Text style={styles.icon}>⭐</Text>
          </View>
          <Text style={styles.label}>My Points</Text>
          <Text style={styles.value}>
            {pointsBalance.toLocaleString('en-IN')}
          </Text>
        </View>
        <Pressable style={styles.historyRow} onPress={onPointsHistory}>
          <Text style={styles.historyText}>Points History</Text>
          <Text style={styles.historyChevron}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  walletCard: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.border,
  },
  pointsCard: {
    backgroundColor: colors.softAmber,
    borderColor: colors.softAmberBorder,
  },
  cardTop: {
    marginBottom: 10,
  },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  walletIconBubble: {},
  pointsIconBubble: {},
  icon: {
    fontSize: 15,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    color: colors.heading,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  historyChevron: {
    fontSize: 14,
    color: colors.primary,
  },
});
