import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { leaderboardEntries } from '../data/leaderboard';
import type { LeaderboardEntry } from '../types/leaderboard';

type LeaderboardScreenProps = {
  onBack: () => void;
};

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  return (
    <View style={[styles.rankBadge, isTop3 && styles.rankBadgeTop]}>
      <Text style={[styles.rankText, isTop3 && styles.rankTextTop]}>
        {rank}
      </Text>
    </View>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <View style={styles.row}>
      <RankBadge rank={entry.rank} />
      <View style={styles.rowTextBlock}>
        <Text style={styles.customer}>{entry.customer}</Text>
        <Text style={styles.gameLabel}>
          {entry.game} · {entry.result}
        </Text>
      </View>
      <Text style={styles.reward}>{entry.reward}</Text>
    </View>
  );
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>{'‹'}</Text>
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
          <Text style={styles.headerSubtitle}>Platform-wide • All games</Text>
        </View>
      </View>

      <FlatList
        data={leaderboardEntries}
        keyExtractor={item => String(item.rank)}
        renderItem={({ item }) => <LeaderboardRow entry={item} />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  backIcon: {
    fontSize: 24,
    color: colors.heading,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.heading,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankBadgeTop: {
    backgroundColor: colors.giftCardAccent,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  rankTextTop: {
    color: colors.giftCardDeep,
  },
  rowTextBlock: {
    flex: 1,
  },
  customer: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.heading,
  },
  gameLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  reward: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.deepGreen,
  },
});
