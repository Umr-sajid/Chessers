/**
 * Offline Persistence Service for User Profile, Settings, and Match History
 */

import { AppSettings, UserStats, GameHistoryEntry } from '../types/chess';

const SETTINGS_KEY = 'chess_app_settings_v1';
const USER_STATS_KEY = 'chess_app_user_stats_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  boardTheme: 'green',
  pieceStyle: 'neo',
  soundEnabled: true,
  soundVolume: 0.8,
  engineThreads: 2,
  engineHashSize: 16,
  showEvalBar: true,
  showLegalMoves: true,
  showMoveHighlights: true,
  showCoordinates: true,
  autoQueen: true,
  allowArrows: true,
  coachEnabled: true,
  coachLevel: 'intermediate',
  engineDepth: 12,
  multiPV: 1,
};

export const DEFAULT_USER_STATS: UserStats = {
  gamesPlayed: 14,
  wins: 9,
  losses: 4,
  draws: 1,
  bulletRating: 1240,
  blitzRating: 1420,
  rapidRating: 1510,
  puzzleRating: 1650,
  puzzleStreak: 3,
  bestPuzzleStreak: 8,
  avgCentipawnLoss: 38,
  brilliantMoveCount: 5,
  greatMoveCount: 18,
  achievements: [
    'First Victory',
    'Tactical Mastermind',
    'Opening Explorer',
    'Brilliant Mind',
  ],
  recentGames: [
    {
      id: 'g_101',
      date: new Date(Date.now() - 3600000 * 5).toLocaleDateString(),
      opponentName: 'Isla',
      opponentRating: 1200,
      userColor: 'w',
      result: '1-0',
      winReason: 'Checkmate',
      accuracyUser: 92,
      accuracyOpponent: 78,
      totalMoves: 34,
      pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O',
      fenHistory: [],
    },
    {
      id: 'g_102',
      date: new Date(Date.now() - 3600000 * 24).toLocaleDateString(),
      opponentName: 'Viktor',
      opponentRating: 1400,
      userColor: 'b',
      result: '0-1',
      winReason: 'Resignation',
      accuracyUser: 88,
      accuracyOpponent: 84,
      totalMoves: 42,
      pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. a3 Bxc3+ 6. Qxc3 b6',
      fenHistory: [],
    }
  ],
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load settings from localStorage:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(USER_STATS_KEY);
    if (raw) return { ...DEFAULT_USER_STATS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load user stats from localStorage:', e);
  }
  return DEFAULT_USER_STATS;
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save user stats:', e);
  }
}

export function addGameToHistory(game: GameHistoryEntry): UserStats {
  const stats = loadUserStats();
  stats.gamesPlayed += 1;
  if (game.result === '1-0' && game.userColor === 'w') stats.wins += 1;
  else if (game.result === '0-1' && game.userColor === 'b') stats.wins += 1;
  else if (game.result === '1/2-1/2') stats.draws += 1;
  else stats.losses += 1;

  stats.recentGames.unshift(game);
  if (stats.recentGames.length > 30) stats.recentGames.pop();

  saveUserStats(stats);
  return stats;
}
