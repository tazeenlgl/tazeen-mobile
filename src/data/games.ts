import { colors } from '../theme/colors';
import type { GameModule } from '../types/game';

// Mock data for UI development only — replace with API-sourced game
// modules once the backend is connected.
export const games: GameModule[] = [
  {
    id: 'stop-and-win',
    title: 'Stop & Win',
    subtitle: 'Stop the timer at the winning second.',
    icon: '⏱️',
    actionLabel: 'PLAY NOW',
    supportingText: "Today's target available",
    accentColor: colors.primary,
    screen: 'StopwatchGame',
  },
  {
    id: 'spin-and-win',
    title: 'Spin & Win',
    subtitle: 'Spin the wheel and try your luck.',
    icon: '🎡',
    actionLabel: 'SPIN NOW',
    supportingText: 'Daily rewards available',
    accentColor: colors.amber,
    screen: 'SpinWinGame',
  },
];
