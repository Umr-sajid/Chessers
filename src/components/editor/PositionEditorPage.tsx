import React, { useState } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { AppSettings } from '../../types/chess';
import { ChessBoard } from '../board/ChessBoard';
import { PieceSvg } from '../board/PieceSvg';
import { Edit3, Copy, Check, RotateCcw } from 'lucide-react';

interface PositionEditorPageProps {
  settings: AppSettings;
}

export const PositionEditorPage: React.FC<PositionEditorPageProps> = ({ settings }) => {
  const [chess] = useState<Chess>(new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [selectedToolPiece, setSelectedToolPiece] = useState<{ type: PieceSymbol; color: Color } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleClearBoard = () => {
    chess.clear();
    setFen(chess.fen());
  };

  const handleResetStandard = () => {
    chess.reset();
    setFen(chess.fen());
  };

  const handleSquareClick = (sq: Square) => {
    if (selectedToolPiece) {
      chess.put({ type: selectedToolPiece.type, color: selectedToolPiece.color }, sq);
      setFen(chess.fen());
    } else {
      chess.remove(sq);
      setFen(chess.fen());
    }
  };

  const pieces: PieceSymbol[] = ['k', 'q', 'r', 'b', 'n', 'p'];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Board Position Editor</h2>
            <p className="text-xs text-slate-400">Set up custom positions, study scenarios, or export FEN strings</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearBoard}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-semibold transition"
          >
            Clear Board
          </button>
          <button
            onClick={handleResetStandard}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
          >
            Reset Standard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[500px]">
            <ChessBoard
              chess={chess}
              boardTheme={settings.boardTheme}
              pieceStyle={settings.pieceStyle}
              interactive={false}
            />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Piece Palette */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Piece Palette</h3>

            {/* White Pieces */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 mb-2 block">White Pieces</span>
              <div className="flex gap-2">
                {pieces.map((p) => (
                  <button
                    key={'w' + p}
                    onClick={() => setSelectedToolPiece({ type: p, color: 'w' })}
                    className={`w-12 h-12 p-2 rounded-xl border transition ${
                      selectedToolPiece?.color === 'w' && selectedToolPiece?.type === p
                        ? 'bg-emerald-500/20 border-emerald-500 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <PieceSvg piece={p} color="w" style={settings.pieceStyle} />
                  </button>
                ))}
              </div>
            </div>

            {/* Black Pieces */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 mb-2 block">Black Pieces</span>
              <div className="flex gap-2">
                {pieces.map((p) => (
                  <button
                    key={'b' + p}
                    onClick={() => setSelectedToolPiece({ type: p, color: 'b' })}
                    className={`w-12 h-12 p-2 rounded-xl border transition ${
                      selectedToolPiece?.color === 'b' && selectedToolPiece?.type === p
                        ? 'bg-emerald-500/20 border-emerald-500 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <PieceSvg piece={p} color="b" style={settings.pieceStyle} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FEN String Display */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated FEN</h3>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 break-all">
              {fen}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(fen);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy FEN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
