/**
 * Game Review Engine
 * Evaluates full game PGNHistory, classifies every move, computes centipawn loss and accuracy %.
 */

import { Chess } from 'chess.js';
import { MoveClassification, MoveRecord, MoveAnalysis } from '../types/chess';
import { evaluatePosition } from './evaluationEngine';
import { OPENINGS_DATABASE } from '../data/openings';

export interface GameReviewReport {
  accuracyWhite: number;
  accuracyBlack: number;
  avgCplWhite: number;
  avgCplBlack: number;
  classificationsWhite: Record<MoveClassification, number>;
  classificationsBlack: Record<MoveClassification, number>;
  reviewedMoves: MoveRecord[];
  evalGraph: number[]; // Pawns evaluation per move
  keyMoments: number[]; // Indices of brilliant, blunders, or turning points
}

export function reviewGame(moveHistory: MoveRecord[]): GameReviewReport {
  const chess = new Chess();
  const reviewedMoves: MoveRecord[] = [];
  const evalGraph: number[] = [0]; // Starting position eval 0
  const keyMoments: number[] = [];

  let totalCplWhite = 0;
  let totalCplBlack = 0;
  let moveCountWhite = 0;
  let moveCountBlack = 0;

  const classificationsWhite: Record<MoveClassification, number> = {
    brilliant: 0,
    great: 0,
    best: 0,
    excellent: 0,
    good: 0,
    book: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
    miss: 0,
    forced: 0,
    only_move: 0,
  };

  const classificationsBlack: Record<MoveClassification, number> = {
    brilliant: 0,
    great: 0,
    best: 0,
    excellent: 0,
    good: 0,
    book: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
    miss: 0,
    forced: 0,
    only_move: 0,
  };

  // Build opening moves set for Book Move classification
  const bookMoveSanSet = new Set<string>();
  OPENINGS_DATABASE.forEach((op) => {
    op.moves.forEach((m) => bookMoveSanSet.add(m));
  });

  for (let idx = 0; idx < moveHistory.length; idx++) {
    const record = moveHistory[idx];
    const color = record.color;

    // Position BEFORE move
    const evalBefore = evaluatePosition(chess).scoreCentipawns;

    // Get legal moves before execution to check if only 1 legal move (forced)
    const legalMovesBefore = chess.moves({ verbose: true });
    const isForcedMove = legalMovesBefore.length === 1;

    // Execute move
    chess.move({ from: record.from, to: record.to, promotion: record.promotion });

    // Position AFTER move
    const evalAfter = evaluatePosition(chess).scoreCentipawns;
    evalGraph.push(evalAfter / 100);

    // Centipawn loss from moving side's perspective
    let cpl = 0;
    if (color === 'w') {
      cpl = Math.max(0, evalBefore - evalAfter);
      totalCplWhite += cpl;
      moveCountWhite++;
    } else {
      cpl = Math.max(0, evalAfter - evalBefore);
      totalCplBlack += cpl;
      moveCountBlack++;
    }

    // Determine move classification
    let classification: MoveClassification = 'good';

    // 1. Check if Book Move (within first 8 ply)
    if (idx < 8 && bookMoveSanSet.has(record.san)) {
      classification = 'book';
    } else if (isForcedMove) {
      classification = 'forced';
    } else {
      // Piece Sacrifice check for Brilliant Move
      const isSacrifice = record.captured && (record.piece === 'q' || record.piece === 'r' || record.piece === 'b' || record.piece === 'n');
      if (isSacrifice && cpl <= 15 && evalAfter * (color === 'w' ? 1 : -1) > 100) {
        classification = 'brilliant';
        keyMoments.push(idx);
      } else if (cpl <= 10) {
        classification = 'best';
      } else if (cpl <= 30) {
        classification = 'excellent';
      } else if (cpl <= 60) {
        classification = 'good';
      } else if (cpl <= 130) {
        classification = 'inaccuracy';
      } else if (cpl <= 300) {
        classification = 'mistake';
      } else {
        classification = 'blunder';
        keyMoments.push(idx);
      }
    }

    // Track classification count
    if (color === 'w') {
      classificationsWhite[classification]++;
    } else {
      classificationsBlack[classification]++;
    }

    const analysis: MoveAnalysis = {
      san: record.san,
      from: record.from,
      to: record.to,
      classification,
      evalBefore: evalBefore / 100,
      evalAfter: evalAfter / 100,
      centipawnLoss: cpl,
      explanation: `Played ${record.san}. Move evaluation change: ${(cpl / 100).toFixed(2)} pawns.`,
    };

    reviewedMoves.push({
      ...record,
      analysis,
    });
  }

  const avgCplWhite = moveCountWhite > 0 ? totalCplWhite / moveCountWhite : 0;
  const avgCplBlack = moveCountBlack > 0 ? totalCplBlack / moveCountBlack : 0;

  // Accuracy formula
  const accuracyWhite = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-avgCplWhite / 80))));
  const accuracyBlack = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-avgCplBlack / 80))));

  return {
    accuracyWhite,
    accuracyBlack,
    avgCplWhite: Math.round(avgCplWhite),
    avgCplBlack: Math.round(avgCplBlack),
    classificationsWhite,
    classificationsBlack,
    reviewedMoves,
    evalGraph,
    keyMoments,
  };
}
