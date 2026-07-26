import React from 'react';
import { COACHES } from '../../data/coaches';
import { CoachLevel } from '../../types/chess';
import { MessageSquare, Sparkles, ChevronDown } from 'lucide-react';

interface CoachPanelProps {
  currentCoachLevel: CoachLevel;
  onChangeCoachLevel: (level: CoachLevel) => void;
  latestExplanation?: string;
  isBotThinking?: boolean;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({
  currentCoachLevel,
  onChangeCoachLevel,
  latestExplanation,
  isBotThinking = false,
}) => {
  const currentCoach = COACHES.find((c) => c.id === currentCoachLevel) || COACHES[1];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Coach Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={currentCoach.avatar}
            alt={currentCoach.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-100 text-sm">{currentCoach.name}</h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentCoach.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentCoach.style}</p>
          </div>
        </div>

        {/* Coach Selector Dropdown */}
        <div className="relative">
          <select
            value={currentCoachLevel}
            onChange={(e) => onChangeCoachLevel(e.target.value as CoachLevel)}
            className="appearance-none bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
          >
            {COACHES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.title})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Real-time Coach Advice Bubble */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs leading-relaxed text-slate-300 flex gap-2.5 items-start">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          {isBotThinking ? (
            <span className="italic text-slate-400 animate-pulse">
              Engine calculating position and evaluating plans...
            </span>
          ) : latestExplanation ? (
            <span>{latestExplanation}</span>
          ) : (
            <span className="text-slate-400">
              Make a move on the board to receive instant move feedback and strategic insights!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
