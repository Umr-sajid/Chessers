import React from 'react';
import { RotateCcw, RotateCw, Lightbulb, Volume2, VolumeX, Eye, EyeOff, Play, Pause, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';

interface BoardControlsProps {
  onFlip?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onFirst?: () => void;
  onLast?: () => void;
  onHint?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  evalBarVisible?: boolean;
  onToggleEvalBar?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const BoardControls: React.FC<BoardControlsProps> = ({
  onFlip,
  onUndo,
  onRedo,
  onFirst,
  onLast,
  onHint,
  soundEnabled = true,
  onToggleSound,
  evalBarVisible = true,
  onToggleEvalBar,
  canUndo = true,
  canRedo = true,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 p-3 bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg w-full max-w-[600px]">
      <div className="flex items-center gap-1">
        {onFirst && (
          <button
            onClick={onFirst}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="First Move"
          >
            <SkipBack className="w-5 h-5" />
          </button>
        )}
        {onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-40 transition"
            title="Undo Move"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {onRedo && (
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-40 transition"
            title="Redo Move"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {onLast && (
          <button
            onClick={onLast}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Last Move"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        {onHint && (
          <button
            onClick={onHint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg text-sm font-semibold transition border border-amber-500/30"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Hint</span>
          </button>
        )}
        {onFlip && (
          <button
            onClick={onFlip}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Flip Board"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        )}
        {onToggleEvalBar && (
          <button
            onClick={onToggleEvalBar}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Toggle Evaluation Bar"
          >
            {evalBarVisible ? <Eye className="w-5 h-5 text-emerald-400" /> : <EyeOff className="w-5 h-5 text-slate-500" />}
          </button>
        )}
        {onToggleSound && (
          <button
            onClick={onToggleSound}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-rose-400" />}
          </button>
        )}
      </div>
    </div>
  );
};
