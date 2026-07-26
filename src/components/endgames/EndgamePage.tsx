import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { ENDGAME_DRILLS } from '../../data/endgames';
import { EndgameDrill, AppSettings } from '../../types/chess';
import { ChessBoard } from '../board/ChessBoard';
import { soundFx } from '../../audio/soundEffects';
import { ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, Award } from 'lucide-react';

interface EndgamePageProps {
  settings: AppSettings;
}

export const EndgamePage: React.FC<EndgamePageProps> = ({ settings }) => {
  const [selectedDrill, setSelectedDrill] = useState<EndgameDrill>(ENDGAME_DRILLS[0]);
  const [chess] = useState<Chess>(() => new Chess(selectedDrill.fen));
  const [, setFen] = useState<string>(chess.fen());
  const [moveCount, setMoveCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSelectDrill = (drill: EndgameDrill) => {
    setSelectedDrill(drill);
    chess.load(drill.fen);
    setFen(chess.fen());
    setMoveCount(0);
    setIsCompleted(false);
  };

  const handleMove = (from: Square, to: Square) => {
    if (isCompleted) return;

    try {
      const move = chess.move({ from, to, promotion: 'q' });
      if (!move) return;

      setFen(chess.fen());
      setMoveCount((prev) => prev + 1);

      if (chess.isCheckmate()) {
        setIsCompleted(true);
        soundFx.playWin();
      } else {
        soundFx.playMove();

        // Engine response in endgame drill
        setTimeout(() => {
          const moves = chess.moves({ verbose: true });
          if (moves.length > 0) {
            const botMove = moves[Math.floor(Math.random() * moves.length)];
            chess.move(botMove);
            setFen(chess.fen());
            if (chess.isCheckmate()) {
              soundFx.playLoss();
            } else {
              soundFx.playMove();
            }
          }
        }, 500);
      }
    } catch (e) {}
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Endgame Technique & Trainer</h2>
            <p className="text-xs text-slate-400">Practice essential endgame positions: Lucena, Philidor, Opposition & Mates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drills List */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          {ENDGAME_DRILLS.map((drill) => (
            <button
              key={drill.id}
              onClick={() => handleSelectDrill(drill)}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                selectedDrill.id === drill.id
                  ? 'bg-rose-500/10 border-rose-500/60 text-rose-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  {drill.category}
                </span>
                <h4 className="font-bold text-xs text-slate-100 mt-1">{drill.title}</h4>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Board & Guide */}
        <div className="lg:col-span-7 flex flex-col items-center gap-5">
          <div className="w-full max-w-[500px]">
            <ChessBoard
              chess={chess}
              boardTheme={settings.boardTheme}
              pieceStyle={settings.pieceStyle}
              onMove={handleMove}
              interactive={!isCompleted}
            />
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-100">{selectedDrill.title}</h3>
              <span className="text-xs font-mono font-bold text-slate-400">Moves: {moveCount}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedDrill.description}</p>

            {isCompleted && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Endgame converted successfully! Outstanding technique!</span>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Principles</h4>
              <ul className="space-y-1">
                {selectedDrill.keyPrinciples.map((p, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
