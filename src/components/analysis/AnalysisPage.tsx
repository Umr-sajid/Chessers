import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from '../board/ChessBoard';
import { EvalBar } from '../board/EvalBar';
import { BoardControls } from '../board/BoardControls';
import { AppSettings, EngineEvalResult } from '../../types/chess';
import { stockfishEngine } from '../../engine/stockfishEngine';
import { evaluatePosition } from '../../engine/evaluationEngine';
import { soundFx } from '../../audio/soundEffects';
import { Search, Play, FileText, Copy, Check, RotateCcw, Cpu } from 'lucide-react';

interface AnalysisPageProps {
  settings: AppSettings;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ settings }) => {
  const [chess] = useState<Chess>(new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [fenInput, setFenInput] = useState<string>(chess.fen());
  const [pgnInput, setPgnInput] = useState<string>('');
  const [evalResult, setEvalResult] = useState<EngineEvalResult | null>(null);

  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    stockfishEngine.setOnEvalUpdate((res) => {
      setEvalResult(res);
    });
    stockfishEngine.analyzePosition(fen, settings.engineDepth);
  }, [fen, settings.engineDepth]);

  const handleMove = (from: Square, to: Square) => {
    try {
      const m = chess.move({ from, to, promotion: 'q' });
      if (m) {
        const newFen = chess.fen();
        setFen(newFen);
        setFenInput(newFen);
        setLastMove({ from, to });
        setMoveHistory((prev) => [...prev, m.san]);
        soundFx.playMove();
      }
    } catch (e) {}
  };

  const handleFenLoad = () => {
    try {
      chess.load(fenInput);
      setFen(chess.fen());
      setMoveHistory([]);
      setLastMove(null);
    } catch (e) {
      alert('Invalid FEN string');
    }
  };

  const handlePgnLoad = () => {
    try {
      chess.loadPgn(pgnInput);
      setFen(chess.fen());
      const history = chess.history();
      setMoveHistory(history);
    } catch (e) {
      alert('Invalid PGN notation');
    }
  };

  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Deep Engine Analysis Board</h2>
            <p className="text-xs text-slate-400">Stockfish calculation engine with Multi-PV lines and depth evaluation</p>
          </div>
        </div>
      </div>

      {/* Main Analysis Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Board */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">
          <div className="w-full max-w-[600px] flex flex-col gap-3">
            <div className="flex gap-3 items-center">
              <EvalBar evaluation={evalResult?.evaluation || 0} />
              <ChessBoard
                chess={chess}
                boardTheme={settings.boardTheme}
                pieceStyle={settings.pieceStyle}
                showLegalMoves={settings.showLegalMoves}
                showCoordinates={settings.showCoordinates}
                onMove={handleMove}
                lastMove={lastMove}
              />
            </div>
            <BoardControls
              onUndo={() => {
                chess.undo();
                setFen(chess.fen());
                setFenInput(chess.fen());
                setMoveHistory((prev) => prev.slice(0, -1));
              }}
              canUndo={moveHistory.length > 0}
            />
          </div>
        </div>

        {/* Right Column: Engine Lines & FEN/PGN Input */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Top Engine Line Output */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engine Calculation</h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">
                  Evaluation: {evalResult?.evaluation !== undefined ? (evalResult.evaluation >= 0 ? `+${evalResult.evaluation.toFixed(2)}` : evalResult.evaluation.toFixed(2)) : '0.00'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Depth {evalResult?.depth || 12}</span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                <span className="text-slate-500 mr-2">Top Line:</span>
                {evalResult?.pv ? evalResult.pv.slice(0, 6).join(' ') : 'e2e4 e7e5 Nf3 Nc6'}
              </div>
            </div>
          </div>

          {/* FEN Loader */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">FEN String Position</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleFenLoad}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
              >
                Load FEN
              </button>
              <button
                onClick={handleCopyFen}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                title="Copy FEN"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Move Log */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col flex-1 min-h-[180px]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Played Moves</h3>
            <div className="flex-1 max-h-[180px] overflow-y-auto font-mono text-xs text-slate-300 space-y-1 p-3 bg-slate-950 rounded-xl border border-slate-800">
              {moveHistory.length === 0 ? (
                <span className="text-slate-500 italic">Play moves on the board to build analysis tree.</span>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {moveHistory.map((m, i) => (
                    <span key={i} className="text-slate-300 font-semibold">
                      {i + 1}. {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
