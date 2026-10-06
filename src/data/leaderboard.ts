import type { LeaderboardEntry } from '../types/leaderboard';

// Mock data for UI development only — replace with API-sourced,
// platform-wide leaderboard results once the backend is connected.
export const leaderboardEntries: LeaderboardEntry[] = [
  { rank: 1, customer: 'Priya', game: 'Stop & Win', result: '0.00s off', reward: '₹500', date: 'Today' },
  { rank: 2, customer: 'Ayesha', game: 'Spin & Win', result: 'Grand Prize', reward: '₹300', date: 'Today' },
  { rank: 3, customer: 'Rahul', game: 'Stop & Win', result: '0.02s off', reward: '₹200', date: 'Today' },
  { rank: 4, customer: 'Sana', game: 'Spin & Win', result: 'Lucky Spin', reward: '₹150', date: 'Today' },
  { rank: 5, customer: 'Zara', game: 'Stop & Win', result: '0.05s off', reward: '₹100', date: 'Today' },
  { rank: 6, customer: 'Imran', game: 'Spin & Win', result: 'Bonus Spin', reward: '₹50', date: 'Yesterday' },
];
