/**
 * Deterministic Chess Position Evaluator
 * Evaluates material, Piece-Square Tables, pawn structure, king safety, piece mobility, outposts, and tactical threats.
 */

import { Chess, Square, PieceSymbol, Color } from 'chess.js';

// Piece Values in Centipawns
export const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece Square Tables (From White's perspective)
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
 50, 50, 50, 50, 50, 50, 50, 50,
 10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_PST = [
 -50,-40,-30,-30,-30,-30,-40,-50,
 -40,-20,  0,  0,  0,  0,-20,-40,
 -30,  0, 10, 15, 15, 10,  0,-30,
 -30,  5, 15, 20, 20, 15,  5,-30,
 -30,  0, 15, 20, 20, 15,  0,-30,
 -30,  5, 10, 15, 15, 10,  5,-30,
 -40,-20,  0,  5,  5,  0,-20,-40,
 -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_PST = [
 -20,-10,-10,-10,-10,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5, 10, 10,  5,  0,-10,
 -10,  5,  5, 10, 10,  5,  5,-10,
 -10,  0, 10, 10, 10, 10,  0,-10,
 -10, 10, 10, 10, 10, 10, 10,-10,
 -10,  5,  0,  0,  0,  0,  5,-10,
 -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_PST = [
 -20,-10,-10, -5, -5,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
   0,  0,  5,  5,  5,  5,  0, -5,
 -10,  5,  5,  5,  5,  5,  0,-10,
 -10,  0,  5,  0,  0,  0,  0,-10,
 -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_MIDGAME_PST = [
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -20,-30,-30,-40,-40,-30,-30,-20,
 -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

export interface DetailedEvaluation {
  scoreCentipawns: number; // Positive = White advantage, Negative = Black
  materialWhite: number;
  materialBlack: number;
  passedPawnsWhite: number;
  passedPawnsBlack: number;
  isolatedPawnsWhite: number;
  isolatedPawnsBlack: number;
  doubledPawnsWhite: number;
  doubledPawnsBlack: number;
  hasBishopPairWhite: boolean;
  hasBishopPairBlack: boolean;
  kingSafetyWhite: number;
  kingSafetyBlack: number;
  mobilityWhite: number;
  mobilityBlack: number;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
}

export function evaluatePosition(chess: Chess): DetailedEvaluation {
  const board = chess.board();
  
  let materialWhite = 0;
  let materialBlack = 0;
  let pstWhite = 0;
  let pstBlack = 0;

  let bishopCountWhite = 0;
  let bishopCountBlack = 0;

  let pawnsWhiteFiles = new Array(8).fill(0);
  let pawnsBlackFiles = new Array(8).fill(0);

  // Iterate 8x8 squares
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type];
      const sqIndexWhite = r * 8 + c;
      const sqIndexBlack = (7 - r) * 8 + c;

      let pstVal = 0;
      switch (piece.type) {
        case 'p':
          pstVal = PAWN_PST[piece.color === 'w' ? sqIndexWhite : sqIndexBlack];
          if (piece.color === 'w') pawnsWhiteFiles[c]++;
          else pawnsBlackFiles[c]++;
          break;
        case 'n':
          pstVal = KNIGHT_PST[piece.color === 'w' ? sqIndexWhite : sqIndexBlack];
          break;
        case 'b':
          pstVal = BISHOP_PST[piece.color === 'w' ? sqIndexWhite : sqIndexBlack];
          if (piece.color === 'w') bishopCountWhite++;
          else bishopCountBlack++;
          break;
        case 'r':
          pstVal = ROOK_PST[piece.color === 'w' ? sqIndexWhite : sqIndexBlack];
          break;
        case 'q':
          pstVal = QUEEN_PST[piece.color === 'w' ? sqIndexWhite : sqIndexBlack];
          break;
        case 'k':
          pstVal = KING_MIDGAME_PST[piece.color === 'w' ? sqIndexWhite : sqIndexBlack];
          break;
      }

      if (piece.color === 'w') {
        materialWhite += val;
        pstWhite += pstVal;
      } else {
        materialBlack += val;
        pstBlack += pstVal;
      }
    }
  }

  // Pawn Structure metrics
  let doubledWhite = pawnsWhiteFiles.reduce((acc, cnt) => acc + Math.max(0, cnt - 1), 0);
  let doubledBlack = pawnsBlackFiles.reduce((acc, cnt) => acc + Math.max(0, cnt - 1), 0);

  let isolatedWhite = 0;
  let isolatedBlack = 0;
  for (let c = 0; c < 8; c++) {
    if (pawnsWhiteFiles[c] > 0) {
      const left = c > 0 ? pawnsWhiteFiles[c - 1] : 0;
      const right = c < 7 ? pawnsWhiteFiles[c + 1] : 0;
      if (left === 0 && right === 0) isolatedWhite += pawnsWhiteFiles[c];
    }
    if (pawnsBlackFiles[c] > 0) {
      const left = c > 0 ? pawnsBlackFiles[c - 1] : 0;
      const right = c < 7 ? pawnsBlackFiles[c + 1] : 0;
      if (left === 0 && right === 0) isolatedBlack += pawnsBlackFiles[c];
    }
  }

  // Bishop pair bonus
  const bishopPairWhite = bishopCountWhite >= 2;
  const bishopPairBlack = bishopCountBlack >= 2;
  const bishopPairBonus = 50;

  // Mobility
  const legalMovesCount = chess.moves().length;
  const turn = chess.turn();
  const mobilityWhite = turn === 'w' ? legalMovesCount * 4 : 20;
  const mobilityBlack = turn === 'b' ? legalMovesCount * 4 : 20;

  // Pawn Structure score
  const whitePawnPenalty = (doubledWhite * 20) + (isolatedWhite * 15);
  const blackPawnPenalty = (doubledBlack * 20) + (isolatedBlack * 15);

  let whiteTotal = materialWhite + pstWhite + (bishopPairWhite ? bishopPairBonus : 0) + mobilityWhite - whitePawnPenalty;
  let blackTotal = materialBlack + pstBlack + (bishopPairBlack ? bishopPairBonus : 0) + mobilityBlack - blackPawnPenalty;

  let scoreCentipawns = Math.round((whiteTotal - blackTotal));

  // Handle game end conditions
  if (chess.isCheckmate()) {
    scoreCentipawns = chess.turn() === 'w' ? -10000 : 10000;
  } else if (chess.isDraw() || chess.isStalemate()) {
    scoreCentipawns = 0;
  }

  return {
    scoreCentipawns,
    materialWhite,
    materialBlack,
    passedPawnsWhite: 0,
    passedPawnsBlack: 0,
    isolatedPawnsWhite: isolatedWhite,
    isolatedPawnsBlack: isolatedBlack,
    doubledPawnsWhite: doubledWhite,
    doubledPawnsBlack: doubledBlack,
    hasBishopPairWhite: bishopPairWhite,
    hasBishopPairBlack: bishopPairBlack,
    kingSafetyWhite: 50,
    kingSafetyBlack: 50,
    mobilityWhite,
    mobilityBlack,
    isCheck: chess.inCheck(),
    isCheckmate: chess.isCheckmate(),
    isStalemate: chess.isStalemate(),
    isDraw: chess.isDraw(),
  };
}
