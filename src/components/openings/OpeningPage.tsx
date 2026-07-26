import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { OPENINGS_DATABASE } from '../../data/openings';
import { OpeningEntry, AppSettings } from '../../types/chess';
import { ChessBoard } from '../board/ChessBoard';
import { BookOpen, Search, Lightbulb, Play, BarChart2 } from 'lucide-react';

interface OpeningPageProps {
  settings: AppSettings;
}

export const OpeningPage: React.FC<OpeningPageProps> = ({ settings }) => {
  const [selectedOpening, setSelectedOpening] = useState<OpeningEntry>(OPENINGS_DATABASE[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const chess = new Chess(selectedOpening.fen);

  const filteredOpenings = OPENINGS_DATABASE.filter(
    (op) =>
      op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.eco.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Offline Opening Explorer & Theory</h2>
            <p className="text-xs text-slate-400">Master famous opening lines, ECO codes, win statistics, and strategic plans</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Opening List */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ECO, name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* List */}
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredOpenings.map((op) => (
              <button
                key={op.eco + op.name}
                onClick={() => setSelectedOpening(op)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  selectedOpening.name === op.name
                    ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      {op.eco}
                    </span>
                    <span className="font-bold text-xs text-slate-100">{op.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{op.moves.join(' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Opening Detail & Board */}
        <div className="lg:col-span-7 flex flex-col items-center gap-5">
          <div className="w-full max-w-[500px]">
            <ChessBoard
              chess={chess}
              boardTheme={settings.boardTheme}
              pieceStyle={settings.pieceStyle}
              interactive={false}
            />
          </div>

          {/* Opening Plan Card */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-100">{selectedOpening.name}</h3>
              <span className="text-xs font-mono font-bold text-cyan-400">{selectedOpening.eco}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedOpening.description}</p>

            {/* Win/Draw/Loss Bar */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Master Statistics</span>
              <div className="h-4 rounded-full overflow-hidden flex text-[10px] font-extrabold text-slate-950">
                <div style={{ width: `${selectedOpening.whiteWinPct}%` }} className="bg-emerald-400 flex items-center justify-center">
                  W {selectedOpening.whiteWinPct}%
                </div>
                <div style={{ width: `${selectedOpening.drawPct}%` }} className="bg-slate-400 flex items-center justify-center">
                  D {selectedOpening.drawPct}%
                </div>
                <div style={{ width: `${selectedOpening.blackWinPct}%` }} className="bg-rose-400 flex items-center justify-center">
                  B {selectedOpening.blackWinPct}%
                </div>
              </div>
            </div>

            {/* Key Ideas */}
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Strategic Plans</h4>
              <ul className="space-y-1">
                {selectedOpening.keyIdeas.map((idea, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{idea}</span>
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
