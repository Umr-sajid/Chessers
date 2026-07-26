import React, { useState, useRef } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { BoardTheme, PieceStyle } from '../../types/chess';
import { PieceSvg } from './PieceSvg';
import { soundFx } from '../../audio/soundEffects';

interface ChessBoardProps {
  chess: Chess;
  boardTheme?: BoardTheme;
  pieceStyle?: PieceStyle;
  orientation?: Color;
  showLegalMoves?: boolean;
  showCoordinates?: boolean;
  onMove?: (from: Square, to: Square, promotion?: PieceSymbol) => void;
  lastMove?: { from: Square; to: Square } | null;
  interactive?: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  boardTheme = 'green',
  pieceStyle = 'neo',
  orientation = 'w',
  showLegalMoves = true,
  showCoordinates = true,
  onMove,
  lastMove = null,
  interactive = true,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalSquares, setLegalSquares] = useState<Square[]>([]);
  const [promotionPending, setPromotionPending] = useState<{ from: Square; to: Square } | null>(null);
  const [arrows, setArrows] = useState<Array<{ from: Square; to: Square; color: string }>>([]);
  const [drawingStart, setDrawingStart] = useState<Square | null>(null);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = orientation === 'w' ? files : [...files].reverse();
  const displayRanks = orientation === 'w' ? ranks : [...ranks].reverse();

  // Color map for board themes
  const themeColors: Record<BoardTheme, { light: string; dark: string; border: string }> = {
    green: { light: '#eeeed2', dark: '#769656', border: '#4a6b2a' },
    wood: { light: '#f0d9b5', dark: '#b58863', border: '#8a5c36' },
    slate: { light: '#e2e8f0', dark: '#64748b', border: '#334155' },
    cyber: { light: '#a5f3fc', dark: '#0284c7', border: '#0369a1' },
    ice: { light: '#e0f2fe', dark: '#38bdf8', border: '#0284c7' },
    charcoal: { light: '#94a3b8', dark: '#334155', border: '#0f172a' },
  };

  const currentTheme = themeColors[boardTheme] || themeColors.green;

  // Find check square if in check
  let checkSquare: Square | null = null;
  if (chess.inCheck()) {
    const turn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          checkSquare = `${files[c]}${ranks[r]}` as Square;
        }
      }
    }
  }

  const handleSquareClick = (sq: Square) => {
    if (!interactive) return;

    // Clear arrows on click
    if (arrows.length > 0) setArrows([]);

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        setLegalSquares([]);
        return;
      }

      // Check if target is a legal move
      const moves = chess.moves({ square: selectedSquare, verbose: true });
      const targetMove = moves.find((m) => m.to === sq);

      if (targetMove) {
        // Check promotion
        if (
          targetMove.piece === 'p' &&
          ((targetMove.color === 'w' && sq.endsWith('8')) || (targetMove.color === 'b' && sq.endsWith('1')))
        ) {
          setPromotionPending({ from: selectedSquare, to: sq });
          return;
        }

        executeMove(selectedSquare, sq);
        setSelectedSquare(null);
        setLegalSquares([]);
        return;
      }
    }

    // Select new piece
    const piece = chess.get(sq);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(sq);
      const moves = chess.moves({ square: sq, verbose: true });
      setLegalSquares(moves.map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setLegalSquares([]);
    }
  };

  const executeMove = (from: Square, to: Square, promo: PieceSymbol = 'q') => {
    if (onMove) {
      onMove(from, to, promo);
    }
  };

  const handleRightMouseDown = (sq: Square) => {
    setDrawingStart(sq);
  };

  const handleRightMouseUp = (sq: Square) => {
    if (drawingStart && drawingStart !== sq) {
      setArrows((prev) => [...prev, { from: drawingStart, to: sq, color: 'rgba(239, 68, 68, 0.8)' }]);
    }
    setDrawingStart(null);
  };

  return (
    <div className="relative w-full max-w-[600px] aspect-square select-none rounded-xl shadow-2xl p-2 bg-slate-900/90 border border-slate-700/60">
      <div
        className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden relative"
        style={{ border: `3px solid ${currentTheme.border}` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {displayRanks.map((r, rIdx) =>
          displayFiles.map((f, fIdx) => {
            const sq = `${f}${r}` as Square;
            const isLight = (fIdx + rIdx) % 2 === 0;
            const piece = chess.get(sq);
            const isSelected = selectedSquare === sq;
            const isLegal = legalSquares.includes(sq);
            const isLastMove = lastMove?.from === sq || lastMove?.to === sq;
            const isCheck = checkSquare === sq;

            return (
              <div
                key={sq}
                id={`square-${sq}`}
                className="relative flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  backgroundColor: isSelected
                    ? 'rgba(234, 179, 8, 0.8)'
                    : isCheck
                    ? 'rgba(239, 68, 68, 0.85)'
                    : isLastMove
                    ? 'rgba(250, 204, 21, 0.45)'
                    : isLight
                    ? currentTheme.light
                    : currentTheme.dark,
                }}
                onClick={() => handleSquareClick(sq)}
                onMouseDown={(e) => {
                  if (e.button === 2) handleRightMouseDown(sq);
                }}
                onMouseUp={(e) => {
                  if (e.button === 2) handleRightMouseUp(sq);
                }}
              >
                {/* Coordinates */}
                {showCoordinates && fIdx === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[10px] font-bold ${
                      isLight ? 'text-slate-600' : 'text-slate-200'
                    }`}
                  >
                    {r}
                  </span>
                )}
                {showCoordinates && rIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${
                      isLight ? 'text-slate-600' : 'text-slate-200'
                    }`}
                  >
                    {f}
                  </span>
                )}

                {/* Legal Move Dot or Capture Ring */}
                {showLegalMoves && isLegal && !piece && (
                  <div className="w-4.5 h-4.5 rounded-full bg-slate-300 border-2 border-black shadow-lg ring-1 ring-white/60 z-10 pointer-events-none" />
                )}
                {showLegalMoves && isLegal && piece && (
                  <div className="absolute inset-1 rounded-full border-4 border-slate-300 ring-2 ring-black bg-slate-900/30 shadow-lg z-10 pointer-events-none" />
                )}

                {/* Chess Piece */}
                {piece && (
                  <div className="w-[85%] h-[85%] transition-transform hover:scale-105">
                    <PieceSvg piece={piece.type} color={piece.color} style={pieceStyle} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Promotion Modal */}
      {promotionPending && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl text-center">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Select Promotion Piece</h3>
            <div className="flex gap-4">
              {(['q', 'r', 'b', 'n'] as PieceSymbol[]).map((p) => (
                <button
                  key={p}
                  className="w-16 h-16 p-2 bg-slate-800 hover:bg-emerald-600 rounded-xl border border-slate-700 transition"
                  onClick={() => {
                    executeMove(promotionPending.from, promotionPending.to, p);
                    setPromotionPending(null);
                  }}
                >
                  <PieceSvg piece={p} color={chess.turn()} style={pieceStyle} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
