import React, { useState, useEffect } from 'react';
import { Chess, Square, Color } from 'chess.js';
import { ChessBoard } from '../board/ChessBoard';
import { PUZZLES } from '../../data/puzzles';
import { Puzzle, AppSettings } from '../../types/chess';
import { soundFx } from '../../audio/soundEffects';
import { loadUserStats, saveUserStats } from '../../utils/storage';
import { Target, Lightbulb, CheckCircle2, XCircle, Flame, Trophy, ArrowRight, RefreshCw, Zap } from 'lucide-react';

interface PuzzlePageProps {
  settings: AppSettings;
}

export const PuzzlePage: React.FC<PuzzlePageProps> = ({ settings }) => {
  const [puzzles] = useState<Puzzle[]>(PUZZLES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentPuzzle = puzzles[currentIndex];

  const [chess] = useState<Chess>(() => new Chess(currentPuzzle.fen));
  const [fen, setFen] = useState<string>(chess.fen());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [status, setStatus] = useState<'solving' | 'correct' | 'failed'>('solving');
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  const [userStats, setUserStats] = useState(() => loadUserStats());

  // Determine whose turn it is to solve
  const puzzleTurn: Color = currentPuzzle.turn || chess.turn();

  // Reset chess board whenever currentIndex changes
  useEffect(() => {
    chess.load(currentPuzzle.fen);
    setFen(chess.fen());
    setStepIndex(0);
    setShowHint(false);
    setStatus('solving');
    setLastMove(null);
  }, [currentIndex, currentPuzzle]);

  const handleMove = (from: Square, to: Square) => {
    if (status !== 'solving') return;

    try {
      const expectedSan = currentPuzzle.solution[stepIndex];
      const move = chess.move({ from, to, promotion: 'q' });
      if (!move) return;

      const normalizeSan = (s: string) => s.replace('+', '').replace('#', '').trim();
      const isCorrectMove =
        move.san === expectedSan ||
        normalizeSan(move.san) === normalizeSan(expectedSan) ||
        (from + to) === expectedSan;

      if (isCorrectMove) {
        soundFx.playMove();
        setFen(chess.fen());
        setLastMove({ from, to });

        const nextStepIndex = stepIndex + 1;

        if (nextStepIndex >= currentPuzzle.solution.length) {
          // Fully solved!
          setStatus('correct');
          soundFx.playWin();
          updateStats(true);
        } else {
          // Play opponent response move automatically after a short delay
          setStepIndex(nextStepIndex);
          setTimeout(() => {
            const botSan = currentPuzzle.solution[nextStepIndex];
            try {
              const botMove = chess.move(botSan);
              if (botMove) {
                setFen(chess.fen());
                setLastMove({ from: botMove.from, to: botMove.to });
                soundFx.playMove();

                const afterBotStep = nextStepIndex + 1;
                setStepIndex(afterBotStep);

                if (afterBotStep >= currentPuzzle.solution.length) {
                  setStatus('correct');
                  soundFx.playWin();
                  updateStats(true);
                }
              }
            } catch (err) {
              console.error('Puzzle bot move error:', err);
            }
          }, 450);
        }
      } else {
        // Failed move
        soundFx.playBlunder();
        setStatus('failed');
        updateStats(false);
      }
    } catch (e) {
      console.error('Puzzle user move error:', e);
    }
  };

  const updateStats = (isCorrect: boolean) => {
    const updated = { ...userStats };
    if (isCorrect) {
      updated.puzzleRating += 15;
      updated.puzzleStreak += 1;
      if (updated.puzzleStreak > updated.bestPuzzleStreak) {
        updated.bestPuzzleStreak = updated.puzzleStreak;
      }
    } else {
      updated.puzzleRating = Math.max(400, updated.puzzleRating - 10);
      updated.puzzleStreak = 0;
    }
    saveUserStats(updated);
    setUserStats(updated);
  };

  const handleNextPuzzle = () => {
    const nextIdx = (currentIndex + 1) % puzzles.length;
    setCurrentIndex(nextIdx);
  };

  const handleRetry = () => {
    chess.load(currentPuzzle.fen);
    setFen(chess.fen());
    setStepIndex(0);
    setShowHint(false);
    setStatus('solving');
    setLastMove(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Tactical Puzzles & Trainer</h2>
            <p className="text-xs text-slate-400">Find the winning line in each position</p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Rating: {userStats.puzzleRating}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Streak: {userStats.puzzleStreak}</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Board */}
        <div className="lg:col-span-7 flex flex-col items-center gap-3">
          {/* Turn Banner */}
          <div className="w-full max-w-[600px] px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${puzzleTurn === 'w' ? 'bg-white border border-slate-900' : 'bg-slate-950 border border-slate-600'}`} />
              <span>{puzzleTurn === 'w' ? 'White to Move & Win' : 'Black to Move & Win'}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Puzzle #{currentIndex + 1} of {puzzles.length}</span>
          </div>

          <div className="w-full max-w-[600px]">
            <ChessBoard
              chess={chess}
              boardTheme={settings.boardTheme}
              pieceStyle={settings.pieceStyle}
              orientation={puzzleTurn}
              showLegalMoves={settings.showLegalMoves}
              showCoordinates={settings.showCoordinates}
              onMove={handleMove}
              lastMove={lastMove}
              interactive={status === 'solving'}
            />
          </div>
        </div>

        {/* Puzzle Controls & Instructions */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg uppercase">
                {currentPuzzle.category.replace('_', ' ')}
              </span>
              <span className="text-xs font-semibold text-slate-400">Rating: {currentPuzzle.rating}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">{currentPuzzle.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">{currentPuzzle.description}</p>
            </div>

            {/* Status Alert */}
            {status === 'correct' && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Puzzle Solved! Outstanding calculation! (+15 Rating)</span>
              </div>
            )}
            {status === 'failed' && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/40 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-bold">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <div>Incorrect move! (-10 Rating)</div>
                  <div className="text-[11px] text-rose-300/80 mt-0.5">Solution sequence was: {currentPuzzle.solution.join(' ')}</div>
                </div>
              </div>
            )}

            {/* Hint Card */}
            {showHint && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                💡 <strong>Hint:</strong> {currentPuzzle.hint}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2">
              {status === 'failed' ? (
                <button
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>Try Again</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              )}

              <button
                onClick={handleNextPuzzle}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition"
              >
                <span>Next Puzzle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
