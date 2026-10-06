// Platform-wide leaderboard — not tied to a single game. Any game
// module can contribute entries by writing its display name into
// `game`, so adding a new game never requires a leaderboard redesign.
export interface LeaderboardEntry {
  rank: number;
  customer: string;
  game: string;
  result: string;
  reward: string;
  date: string;
}
