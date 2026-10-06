// Every playable module registers itself here so the Game Hub can list
// and route to games without redesigning the hub when a new game ships.
export type GameScreenKey = 'StopwatchGame' | 'SpinWinGame';

export interface GameModule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  actionLabel: string;
  supportingText: string;
  accentColor: string;
  screen: GameScreenKey;
}
