/**
 * Core Types for Offline Chess Application
 */

import { Square, PieceSymbol, Color } from 'chess.js';

export type GameMode =
  | 'vs_computer'
  | 'vs_human'
  | 'computer_vs_computer'
  | 'analysis'
  | 'puzzle'
  | 'opening_practice'
  | 'endgame_practice'
  | 'position_editor';

export type BoardTheme = 'green' | 'wood' | 'slate' | 'cyber' | 'ice' | 'charcoal';
export type PieceStyle = 'neo' | 'alpha' | 'glass' | 'wood' | 'minimal';
export type AppTheme = 'dark' | 'light' | 'minimal';

export type MoveClassification =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'book'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder'
  | 'miss'
  | 'forced'
  | 'only_move';

export interface MoveAnalysis {
  san: string;
  from: Square;
  to: Square;
  classification: MoveClassification;
  evalBefore: number; // in pawns e.g. +1.5 or -0.8
  evalAfter: number; // in pawns
  centipawnLoss: number;
  bestMoveSan?: string;
  bestMoveFromTo?: { from: Square; to: Square };
  explanation: string;
  tacticalMotif?: string;
  positionalMotif?: string;
  pvLines?: string[];
}

export interface MoveRecord {
  san: string;
  from: Square;
  to: Square;
  piece: PieceSymbol;
  color: Color;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
  fen: string;
  clockTimeLeft?: number; // seconds
  analysis?: MoveAnalysis;
}

export interface BotPersonality {
  id: string;
  name: string;
  title?: string;
  rating: number;
  avatar: string;
  description: string;
  style: 'aggressive' | 'positional' | 'tactical' | 'defensive' | 'endgame' | 'balanced' | 'random' | 'bullet' | 'adaptive';
  skillLevel: number; // Stockfish Skill level 0 - 20
  depthLimit: number;
  maxRandomness: number; // in centipawns
  quote: string;
  countryFlag: string;
  openingPreference?: string;
  tacticalStrength: number; // 0 - 100
  positionalStrength: number; // 0 - 100
  endgameStrength: number; // 0 - 100
}

export type CoachLevel = 'beginner' | 'intermediate' | 'advanced' | 'master' | 'grandmaster';

export interface Coach {
  id: CoachLevel;
  name: string;
  title: string;
  avatar: string;
  description: string;
  style: string;
  focus: string[];
}

export interface Puzzle {
  id: string;
  title: string;
  fen: string;
  turn?: Color; // 'w' or 'b'
  solution: string[]; // array of SAN moves: [playerMove, computerResponse, playerMove...]
  rating: number;
  category: 'mate_in_1' | 'mate_in_2' | 'mate_in_3' | 'fork' | 'pin' | 'skewer' | 'discovered_attack' | 'deflection' | 'sacrifice' | 'promotion';
  difficulty: 'easy' | 'medium' | 'hard' | 'master' | 'grandmaster';
  description: string;
  hint: string;
}

export interface OpeningEntry {
  eco: string;
  name: string;
  moves: string[]; // SAN array
  fen: string;
  description: string;
  keyIdeas: string[];
  whiteWinPct: number;
  drawPct: number;
  blackWinPct: number;
  category: 'King\'s Pawn' | 'Queen\'s Pawn' | 'Flank' | 'Semi-Open' | 'Closed';
}

export interface EndgameDrill {
  id: string;
  title: string;
  category: 'King & Pawn' | 'Rook Endgames' | 'Queen Endgames' | 'Bishop Endgames' | 'Knight Endgames' | 'Basic Mates';
  fen: string;
  description: string;
  goal: string;
  keyPrinciples: string[];
  targetMovesToWin?: number;
}

export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  bulletRating: number;
  blitzRating: number;
  rapidRating: number;
  puzzleRating: number;
  puzzleStreak: number;
  bestPuzzleStreak: number;
  avgCentipawnLoss: number;
  brilliantMoveCount: number;
  greatMoveCount: number;
  achievements: string[];
  recentGames: GameHistoryEntry[];
}

export interface GameHistoryEntry {
  id: string;
  date: string;
  opponentName: string;
  opponentRating: number;
  userColor: Color;
  result: '1-0' | '0-1' | '1/2-1/2';
  winReason?: string;
  accuracyUser: number;
  accuracyOpponent: number;
  totalMoves: number;
  pgn: string;
  fenHistory: string[];
}

export interface AppSettings {
  theme: AppTheme;
  boardTheme: BoardTheme;
  pieceStyle: PieceStyle;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  engineThreads: number;
  engineHashSize: number; // MB
  showEvalBar: boolean;
  showLegalMoves: boolean;
  showMoveHighlights: boolean;
  showCoordinates: boolean;
  autoQueen: boolean;
  allowArrows: boolean;
  coachEnabled: boolean;
  coachLevel: CoachLevel;
  engineDepth: number;
  multiPV: number; // 1 to 4
}

export interface EngineEvalResult {
  evaluation: number; // Centipawns relative to White (positive = White ahead, negative = Black ahead)
  isMate: boolean;
  mateIn?: number;
  bestMove?: { from: Square; to: Square; promotion?: PieceSymbol; san?: string };
  pv: string[]; // array of SAN moves
  depth: number;
  nodes: number;
  nps: number;
  multipv?: Array<{
    evaluation: number;
    isMate: boolean;
    mateIn?: number;
    pv: string[];
    bestMove?: { from: Square; to: Square; promotion?: PieceSymbol; san?: string };
  }>;
}
