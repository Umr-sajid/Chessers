import React from 'react';

interface EvalBarProps {
  evaluation: number; // In pawns, positive = White, negative = Black
  isMate?: boolean;
  mateIn?: number;
  orientation?: 'w' | 'b';
}

export const EvalBar: React.FC<EvalBarProps> = ({ evaluation, isMate = false, mateIn, orientation = 'w' }) => {
  // Convert evaluation into percentage height for White
  // Range clamped between -10 and +10 pawns
  let whiteHeightPct = 50;
  if (isMate && mateIn !== undefined) {
    whiteHeightPct = mateIn > 0 ? 100 : 0;
  } else {
    const clampedEval = Math.max(-10, Math.min(10, evaluation));
    whiteHeightPct = 50 + (clampedEval / 10) * 45;
  }

  const whiteHeight = orientation === 'w' ? whiteHeightPct : 100 - whiteHeightPct;
  const evalText = isMate
    ? `M${Math.abs(mateIn || 0)}`
    : `${evaluation >= 0 ? '+' : ''}${evaluation.toFixed(1)}`;

  return (
    <div className="w-6 h-[480px] rounded-lg overflow-hidden flex flex-col border border-slate-700 bg-slate-900 shadow-xl relative select-none">
      {/* Black Section */}
      <div
        className="w-full bg-slate-900 transition-all duration-300 flex items-start justify-center pt-2"
        style={{ height: `${100 - whiteHeight}%` }}
      >
        {whiteHeight < 50 && (
          <span className="text-[11px] font-extrabold text-slate-100">{evalText}</span>
        )}
      </div>

      {/* White Section */}
      <div
        className="w-full bg-slate-100 transition-all duration-300 flex items-end justify-center pb-2"
        style={{ height: `${whiteHeight}%` }}
      >
        {whiteHeight >= 50 && (
          <span className="text-[11px] font-extrabold text-slate-900">{evalText}</span>
        )}
      </div>
    </div>
  );
};
