import React, { useState } from 'react';
import { GameReviewReport } from '../../engine/gameReviewEngine';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from '../board/ChessBoard';
import { MoveClassification } from '../../types/chess';
import { Award, Zap, AlertTriangle, XCircle, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, X, TrendingUp } from 'lucide-react';

interface GameReviewModalProps {
  report: GameReviewReport;
  whiteName?: string;
  blackName?: string;
  onClose: () => void;
}

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  report,
  whiteName = 'White',
  blackName = 'Black',
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Reconstruct chess position at currentStepIndex
  const chess = new Chess();
  for (let i = 0; i < currentStepIndex && i < report.reviewedMoves.length; i++) {
    const m = report.reviewedMoves[i];
    try {
      chess.move({ from: m.from, to: m.to, promotion: m.promotion });
    } catch (e) {}
  }

  const currentMove = currentStepIndex > 0 ? report.reviewedMoves[currentStepIndex - 1] : null;

  // Icon mapping for move classifications
  const getClassificationBadge = (cls?: MoveClassification) => {
    switch (cls) {
      case 'brilliant':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded text-xs font-bold">!! Brilliant</span>;
      case 'great':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded text-xs font-bold">! Great Move</span>;
      case 'best':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-xs font-bold">⭐ Best Move</span>;
      case 'excellent':
        return <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded text-xs font-bold">✓ Excellent</span>;
      case 'good':
        return <span className="bg-slate-700 text-slate-200 border border-slate-600 px-2 py-0.5 rounded text-xs font-bold">Good</span>;
      case 'book':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-xs font-bold">📖 Book Move</span>;
      case 'inaccuracy':
        return <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded text-xs font-bold">?! Inaccuracy</span>;
      case 'mistake':
        return <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded text-xs font-bold">? Mistake</span>;
      case 'blunder':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded text-xs font-bold">?? Blunder</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Full Game Review & Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Board Display */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <ChessBoard
              chess={chess}
              interactive={false}
              lastMove={currentMove ? { from: currentMove.from, to: currentMove.to } : null}
            />

            {/* Stepper Controls */}
            <div className="flex items-center justify-between w-full max-w-[600px] mt-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setCurrentStepIndex(0)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentStepIndex === 0}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Move {currentStepIndex} / {report.reviewedMoves.length}
                </span>
                <button
                  onClick={() => setCurrentStepIndex((prev) => Math.min(report.reviewedMoves.length, prev + 1))}
                  disabled={currentStepIndex === report.reviewedMoves.length}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Metrics & Breakdown */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Accuracy Score Banner */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{whiteName}</span>
                <span className="text-3xl font-extrabold text-emerald-400 mt-1">{report.accuracyWhite}%</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Accuracy</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{blackName}</span>
                <span className="text-3xl font-extrabold text-teal-400 mt-1">{report.accuracyBlack}%</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Accuracy</span>
              </div>
            </div>

            {/* Current Move Detail Card */}
            {currentMove && currentMove.analysis ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200">
                    Move {currentStepIndex}: <span className="text-emerald-400 font-mono">{currentMove.san}</span>
                  </span>
                  {getClassificationBadge(currentMove.analysis.classification)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {currentMove.analysis.explanation}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
                  <span>Centipawn Loss: <strong className="text-amber-400">{currentMove.analysis.centipawnLoss}</strong></span>
                  <span>Eval: <strong className="text-slate-200">{currentMove.analysis.evalAfter >= 0 ? '+' : ''}{currentMove.analysis.evalAfter.toFixed(2)}</strong></span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                Use the controls above to step through moves and inspect classifications.
              </div>
            )}

            {/* Move Classifications Table */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Move Classification Breakdown</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-cyan-400 font-semibold">!! Brilliant</span>
                  <span className="font-mono font-bold text-slate-200">{report.classificationsWhite.brilliant} / {report.classificationsBlack.brilliant}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-emerald-400 font-semibold">⭐ Best</span>
                  <span className="font-mono font-bold text-slate-200">{report.classificationsWhite.best} / {report.classificationsBlack.best}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-yellow-400 font-semibold">?! Inaccuracy</span>
                  <span className="font-mono font-bold text-slate-200">{report.classificationsWhite.inaccuracy} / {report.classificationsBlack.inaccuracy}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                  <span className="text-rose-400 font-semibold">?? Blunder</span>
                  <span className="font-mono font-bold text-slate-200">{report.classificationsWhite.blunder} / {report.classificationsBlack.blunder}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
