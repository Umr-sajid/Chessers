import React from 'react';
import { Clock as ClockIcon } from 'lucide-react';

interface ClockProps {
  timeSeconds: number; // in seconds
  isActive: boolean;
  playerName: string;
  rating?: number;
  avatar?: string;
  capturedPieces?: string[];
  materialDifference?: number;
}

export const Clock: React.FC<ClockProps> = ({
  timeSeconds,
  isActive,
  playerName,
  rating,
  avatar,
  capturedPieces = [],
  materialDifference = 0,
}) => {
  const mins = Math.floor(timeSeconds / 60);
  const secs = Math.floor(timeSeconds % 60);
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  const isLowTime = timeSeconds < 30;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
        isActive
          ? 'bg-slate-800/90 border-emerald-500/70 shadow-lg shadow-emerald-500/10'
          : 'bg-slate-900/80 border-slate-800'
      }`}
    >
      {/* Player Profile & Captures */}
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={playerName} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700">
            {playerName[0]}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-100">{playerName}</span>
            {rating && <span className="text-xs text-slate-400 font-medium">({rating})</span>}
          </div>
          {/* Captured Pieces Display */}
          <div className="flex items-center gap-1 mt-0.5 min-h-[16px]">
            {capturedPieces.map((p, idx) => (
              <span key={idx} className="text-xs text-slate-300 font-semibold uppercase">
                {p}
              </span>
            ))}
            {materialDifference > 0 && (
              <span className="text-[11px] font-extrabold text-emerald-400 ml-1">+{materialDifference}</span>
            )}
          </div>
        </div>
      </div>

      {/* Digital Time Display */}
      <div
        className={`px-4 py-2 rounded-lg font-mono font-bold text-lg flex items-center gap-2 border transition-colors ${
          isActive
            ? isLowTime
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-slate-950/80 text-slate-400 border-slate-800'
        }`}
      >
        <ClockIcon className="w-4 h-4 opacity-75" />
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};
