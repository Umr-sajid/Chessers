/**
 * Offline Algorithmic Coach Engine
 * Generates level-tailored natural language move explanations without any external AI API.
 */

import { Chess, Square } from 'chess.js';
import { CoachLevel } from '../types/chess';
import { evaluatePosition } from './evaluationEngine';

export interface MoveContext {
  san: string;
  from: Square;
  to: Square;
  piece: string;
  captured?: string;
  promotion?: string;
  isCheck: boolean;
  isCheckmate: boolean;
  evalBefore: number; // Centipawns
  evalAfter: number; // Centipawns
  bestMoveSan?: string;
}

export function generateCoachExplanation(
  chessBefore: Chess,
  chessAfter: Chess,
  moveCtx: MoveContext,
  coachLevel: CoachLevel
): string {
  const { san, piece, captured, isCheck, isCheckmate, evalBefore, evalAfter, bestMoveSan } = moveCtx;
  const turn = chessBefore.turn();
  const colorName = turn === 'w' ? 'White' : 'Black';

  const evalDelta = (turn === 'w' ? (evalAfter - evalBefore) : (evalBefore - evalAfter)) / 100; // in pawns

  // Special Checkmate / Check
  if (isCheckmate) {
    return coachLevel === 'beginner'
      ? `Checkmate! Outstanding play! You delivered checkmate with ${san}!`
      : `Checkmate! Excellent tactical pattern forcing terminal checkmate on the king.`;
  }

  // Castling
  if (san === 'O-O' || san === 'O-O-O') {
    switch (coachLevel) {
      case 'beginner':
        return `Castling protects your King and connects your Rooks! A great defensive habit.`;
      case 'intermediate':
        return `Castling safety locks your king into shelter while activating your rook along the back rank.`;
      case 'advanced':
      case 'master':
      case 'grandmaster':
        return `Castling achieves immediate king safety while integrating rook activity into central files.`;
    }
  }

  // Captures
  if (captured) {
    const pieceNames: Record<string, string> = {
      p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King'
    };
    const capName = pieceNames[captured] || 'piece';
    if (evalDelta < -1.5) {
      return coachLevel === 'beginner'
        ? `Be careful! Capturing that ${capName} left your own piece undefended.`
        : `Unsound capture. The tactical exchange loses net centipawn evaluation.`;
    }
    return coachLevel === 'beginner'
      ? `Great capture! Taking the enemy ${capName} increases your material lead.`
      : `Profitable capture on ${moveCtx.to}, gaining material and simplifying the position favorably.`;
  }

  // Blunder / Inaccuracy detection based on eval delta
  if (evalDelta <= -2.0) {
    if (bestMoveSan) {
      return coachLevel === 'beginner'
        ? `Watch out! ${san} drops material or positional ground. Consider playing ${bestMoveSan} instead.`
        : `Blunder (-${Math.abs(evalDelta).toFixed(1)} pawns). ${san} weakens your position; ${bestMoveSan} was substantially better.`;
    }
    return `Inaccuracy (-${Math.abs(evalDelta).toFixed(1)} pawns). Be cautious with piece placement.`;
  }

  // Center Control & Piece Development
  const centralSquares = ['d4', 'd5', 'e4', 'e5'];
  if (centralSquares.includes(moveCtx.to)) {
    if (piece === 'p') {
      return coachLevel === 'beginner'
        ? `Moving your pawn to ${moveCtx.to} stakes a claim in the center of the board.`
        : `Central pawn push ${san} gains space and restricts enemy piece mobility.`;
    }
    return coachLevel === 'beginner'
      ? `Developing your ${piece.toUpperCase()} to ${moveCtx.to} influences key central squares!`
      : `Centralization move ${san} places piece active pressure on d4/e4/d5/e5 control hubs.`;
  }

  // Checks
  if (isCheck) {
    return coachLevel === 'beginner'
      ? `Check! You attacked the opponent's King with ${san}.`
      : `Forcing check with ${san}, interrupting enemy momentum and creating tactical pressure.`;
  }

  // Standard Good Move
  if (evalDelta >= -0.2) {
    switch (coachLevel) {
      case 'beginner':
        return `Solid move! ${san} improves your piece placement and maintains game control.`;
      case 'intermediate':
        return `${san} enhances piece coordination while preserving structural balance.`;
      case 'advanced':
      case 'master':
      case 'grandmaster':
        return `High-tier move ${san}: solidifies key squares, limits opponent counterplay, and preserves tempo.`;
    }
  }

  return `Played ${san}. Position remains balanced and flexible.`;
}
