import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { evaluatePosition } from '../../engine/evaluationEngine';
import { reviewGame } from '../../engine/gameReviewEngine';
import { PUZZLES } from '../../data/puzzles';
import { MoveRecord } from '../../types/chess';
import { CheckCircle2, XCircle, ShieldCheck, Play, X, RefreshCw } from 'lucide-react';

interface TestCaseResult {
  name: string;
  category: string;
  passed: boolean;
  message: string;
}

interface DiagnosticsModalProps {
  onClose: () => void;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({ onClose }) => {
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runAllTests = () => {
    setIsRunning(true);
    const testResults: TestCaseResult[] = [];

    // Test 1: Standard Initial FEN
    try {
      const c = new Chess();
      const evalRes = evaluatePosition(c);
      testResults.push({
        name: 'Initial Position Evaluation',
        category: 'Engine Rules',
        passed: evalRes.scoreCentipawns === 0 && !evalRes.isCheck,
        message: `Initial score: ${evalRes.scoreCentipawns} CP`,
      });
    } catch (e: any) {
      testResults.push({ name: 'Initial Position Evaluation', category: 'Engine Rules', passed: false, message: e.message });
    }

    // Test 2: Scholar's Mate
    try {
      const c = new Chess();
      c.move('e4');
      c.move('e5');
      c.move('Qf3');
      c.move('Nc6');
      c.move('Bc4');
      c.move('d6');
      c.move('Qxf7#');
      const evalRes = evaluatePosition(c);
      testResults.push({
        name: "Scholar's Mate Checkmate Detection",
        category: 'Rules & Legality',
        passed: c.isCheckmate() && evalRes.isCheckmate,
        message: 'Scholar\'s mate properly identified as terminal checkmate.',
      });
    } catch (e: any) {
      testResults.push({ name: "Scholar's Mate Checkmate Detection", category: 'Rules & Legality', passed: false, message: e.message });
    }

    // Test 3: Game Review Classification
    try {
      const mockMoves: MoveRecord[] = [
        { san: 'e4', from: 'e2', to: 'e4', piece: 'p', color: 'w', fen: '' },
        { san: 'e5', from: 'e7', to: 'e5', piece: 'p', color: 'b', fen: '' },
        { san: 'Nf3', from: 'g1', to: 'f3', piece: 'n', color: 'w', fen: '' },
        { san: 'f6', from: 'f7', to: 'f6', piece: 'p', color: 'b', fen: '' }, // Inaccuracy/Mistake
        { san: 'Nxe5', from: 'f3', to: 'e5', piece: 'n', color: 'w', captured: 'p', fen: '' }, // Sacrifice
      ];
      const review = reviewGame(mockMoves);
      testResults.push({
        name: 'Game Review Classification & Accuracy',
        category: 'Game Review',
        passed: review.reviewedMoves.length === 5 && review.accuracyWhite > 0,
        message: `Calculated White accuracy: ${review.accuracyWhite}%, Black accuracy: ${review.accuracyBlack}%`,
      });
    } catch (e: any) {
      testResults.push({ name: 'Game Review Classification & Accuracy', category: 'Game Review', passed: false, message: e.message });
    }

    // Test 4: Puzzle Solution Legal Moves
    try {
      let puzzleErrors = 0;
      PUZZLES.forEach((p) => {
        const c = new Chess(p.fen);
        p.solution.forEach((mSan) => {
          try {
            const m = c.move(mSan);
            if (!m) puzzleErrors++;
          } catch {
            puzzleErrors++;
          }
        });
      });
      testResults.push({
        name: 'Puzzle Dataset Legality Check',
        category: 'Puzzles',
        passed: puzzleErrors === 0,
        message: puzzleErrors === 0 ? `All ${PUZZLES.length} puzzles verified legal.` : `Found ${puzzleErrors} invalid puzzle moves.`,
      });
    } catch (e: any) {
      testResults.push({ name: 'Puzzle Dataset Legality Check', category: 'Puzzles', passed: false, message: e.message });
    }

    setResults(testResults);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-100">Automated App Verification Suite</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Run Complete Verification Test Suite</span>
          </button>

          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
            {results.map((t, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  {t.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-slate-200">{t.name}</div>
                    <div className="text-[10px] text-slate-400">{t.message}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {t.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
