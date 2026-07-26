/**
 * Advanced Minimax Chess Engine with Alpha-Beta Pruning,
 * Quiescence Search, Move Ordering (MVV-LVA), and Opening Book.
 */

import { Chess, Square, PieceSymbol, Move } from 'chess.js';
import { evaluatePosition, PIECE_VALUES } from './evaluationEngine';

// Common Opening Book
const OPENING_BOOK: Record<string, string[]> = {
  // Initial position
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': ['e4', 'd4', 'c4', 'Nf3'],
  // 1. e4
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1': ['e5', 'c5', 'e6', 'c6'],
  // 1. e4 e5
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': ['Nf3', 'Bc4', 'Nc3'],
  // 1. e4 e5 2. Nf3
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2': ['Nc6', 'Nf6', 'd6'],
  // 1. d4
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1': ['d5', 'Nf6', 'e6'],
  // 1. d4 d5
  'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2': ['c4', 'Nf3', 'e3'],
};

// Evaluate move priority for Move Ordering (MVV - LVA)
function scoreMove(move: Move, chess: Chess): number {
  let score = 0;

  // Most Valuable Victim - Least Valuable Attacker
  if (move.captured) {
    const victimValue = PIECE_VALUES[move.captured] || 100;
    const attackerValue = PIECE_VALUES[move.piece] || 100;
    score += victimValue * 10 - attackerValue;
  }

  // Promotion
  if (move.promotion) {
    score += 800;
  }

  // Check
  const tempBoard = new Chess(chess.fen());
  tempBoard.move(move);
  if (tempBoard.inCheck()) {
    score += 150;
  }

  return score;
}

// Order moves to optimize Alpha-Beta pruning
function orderMoves(moves: Move[], chess: Chess): Move[] {
  return moves.sort((a, b) => scoreMove(b, chess) - scoreMove(a, chess));
}

// Quiescence Search to prevent horizon effect on captures/checks
function quiescenceSearch(chess: Chess, alpha: number, beta: number, isMaximizing: boolean): number {
  const standPat = evaluatePosition(chess).scoreCentipawns;

  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;
  } else {
    if (standPat <= alpha) return alpha;
    if (standPat < beta) beta = standPat;
  }

  // Generate captures only
  const moves = chess.moves({ verbose: true }).filter((m) => m.captured || m.san.includes('+'));
  const orderedMoves = orderMoves(moves, chess);

  for (const move of orderedMoves) {
    const tempChess = new Chess(chess.fen());
    tempChess.move(move);

    const score = quiescenceSearch(tempChess, alpha, beta, !isMaximizing);

    if (isMaximizing) {
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    } else {
      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
  }

  return isMaximizing ? alpha : beta;
}

// Minimax with Alpha-Beta Pruning
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    if (depth === 0) {
      return quiescenceSearch(chess, alpha, beta, isMaximizing);
    }
    return evaluatePosition(chess).scoreCentipawns;
  }

  const moves = orderMoves(chess.moves({ verbose: true }), chess);
  if (moves.length === 0) return evaluatePosition(chess).scoreCentipawns;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const tempChess = new Chess(chess.fen());
      tempChess.move(move);
      const evalScore = minimax(tempChess, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Alpha-beta cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const tempChess = new Chess(chess.fen());
      tempChess.move(move);
      const evalScore = minimax(tempChess, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Alpha-beta cutoff
    }
    return minEval;
  }
}

/**
 * Main function to calculate best engine move for a given rating
 */
export function getBestEngineMove(chess: Chess, botRating: number): Move | null {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  // 1. Check Opening Book
  const fen = chess.fen();
  const bookCandidates = OPENING_BOOK[fen];
  if (bookCandidates && bookCandidates.length > 0 && Math.random() < 0.85) {
    const bookSan = bookCandidates[Math.floor(Math.random() * bookCandidates.length)];
    const matchingMove = moves.find((m) => m.san === bookSan);
    if (matchingMove) return matchingMove;
  }

  // 2. Determine Search Depth and Randomness based on Bot Rating
  let depth = 3;
  let blunderProbability = 0;

  if (botRating < 600) {
    depth = 1;
    blunderProbability = 0.4;
  } else if (botRating < 1000) {
    depth = 2;
    blunderProbability = 0.25;
  } else if (botRating < 1400) {
    depth = 3;
    blunderProbability = 0.1;
  } else if (botRating < 1800) {
    depth = 3;
    blunderProbability = 0.03;
  } else if (botRating < 2400) {
    depth = 4;
    blunderProbability = 0;
  } else {
    depth = 4; // Max depth for instant web UI responsiveness with quiescence search
    blunderProbability = 0;
  }

  // Blunder chance for beginner bots
  if (blunderProbability > 0 && Math.random() < blunderProbability) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
  }

  const isMaximizing = chess.turn() === 'w';
  let bestMove: Move = moves[0];
  let bestValue = isMaximizing ? -Infinity : Infinity;

  const ordered = orderMoves(moves, chess);

  for (const move of ordered) {
    const tempChess = new Chess(chess.fen());
    tempChess.move(move);

    // Evaluate position with minimax search
    const boardValue = minimax(tempChess, depth - 1, -Infinity, Infinity, !isMaximizing);

    if (isMaximizing) {
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    } else {
      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

export { getBestEngineMove as getBestBotMove };
