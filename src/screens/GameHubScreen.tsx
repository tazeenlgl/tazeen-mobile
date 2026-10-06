import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';
import NotificationBell from '../components/common/NotificationBell';
import BottomNavigation from '../components/home/BottomNavigation';
import PrimaryGameCard from '../components/game/PrimaryGameCard';
import CompactGameCard from '../components/game/CompactGameCard';
import LeaderboardCard from '../components/game/LeaderboardCard';
import { games } from '../data/games';
import type { GameScreenKey } from '../types/game';

type GameHubScreenProps = {
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onNavigate?: (key: string) => void;
  onCartPress: () => void;
  onOpenGame: (screen: GameScreenKey) => void;
  onOpenLeaderboard: () => void;
};

export default function GameHubScreen({
  drawerOpen,
  onMenuPress,
  onDrawerClose,
  onNavigate,
  onCartPress,
  onOpenGame,
  onOpenLeaderboard,
}: GameHubScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeNav, setActiveNav] = useState('game');

  const navBarBottomOffset = insets.bottom + 16;
  const navBarClearance = navBarBottomOffset + 76;

  const handleNavChange = (key: string) => {
    setActiveNav(key);
    onNavigate?.(key);
  };

  const [primaryGame, secondaryGame] = games;

  return (
    <View style={styles.flex}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 10,
            paddingBottom: navBarClearance,
          },
        ]}
      >
        <TopBar
          logo
          onMenuPress={onMenuPress}
          onCartPress={onCartPress}
          rightAccessory={<NotificationBell count={2} />}
        />

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Game</Text>
          <Text style={styles.pageSubtitle}>Play • Win • Earn Rewards</Text>
        </View>

        <View style={styles.middle}>
          <View style={styles.primaryWrap}>
            <PrimaryGameCard
              game={primaryGame}
              onPress={() => onOpenGame(primaryGame.screen)}
            />
          </View>

          <CompactGameCard
            game={secondaryGame}
            onPress={() => onOpenGame(secondaryGame.screen)}
          />

          <LeaderboardCard onPress={onOpenLeaderboard} />
        </View>
      </View>

      <BottomNavigation
        activeKey={activeNav}
        onChange={handleNavChange}
        bottomOffset={navBarBottomOffset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleRow: {
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.heading,
    marginBottom: 1,
  },
  pageSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  middle: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  primaryWrap: {
    height: 220,
  },
});
