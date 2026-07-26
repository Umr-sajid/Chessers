import React, { useState } from 'react';
import { loadUserStats } from '../../utils/storage';
import { UserStats, GameHistoryEntry } from '../../types/chess';
import { User, Trophy, Award, Flame, Zap, BarChart3, History, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [stats] = useState<UserStats>(() => loadUserStats());

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* User Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-2xl text-slate-950 shadow-lg">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">Grandmaster User</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO Offline
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Local Profile • Registered Offline Player</p>
          </div>
        </div>

        {/* Rating Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Rapid</span>
            <span className="text-lg font-extrabold text-emerald-400">{stats.rapidRating}</span>
          </div>
          <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Blitz</span>
            <span className="text-lg font-extrabold text-teal-400">{stats.blitzRating}</span>
          </div>
          <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Puzzle</span>
            <span className="text-lg font-extrabold text-amber-400">{stats.puzzleRating}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
          <span className="text-xs text-slate-400 font-semibold">Games Played</span>
          <span className="text-2xl font-extrabold text-slate-100 mt-1">{stats.gamesPlayed}</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
          <span className="text-xs text-slate-400 font-semibold">Win Rate</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1">{winRate}%</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
          <span className="text-xs text-slate-400 font-semibold">Avg Centipawn Loss</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1">{stats.avgCentipawnLoss}</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
          <span className="text-xs text-slate-400 font-semibold">Brilliant Moves</span>
          <span className="text-2xl font-extrabold text-cyan-400 mt-1">{stats.brilliantMoveCount}</span>
        </div>
      </div>

      {/* Recent Games List */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Match History</span>
          </h3>
          <span className="text-xs text-slate-400">{stats.recentGames.length} Saved Matches</span>
        </div>

        <div className="flex flex-col gap-2">
          {stats.recentGames.map((game) => (
            <div
              key={game.id}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    game.result === '1-0' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {game.result}
                </span>
                <div>
                  <div className="font-bold text-slate-200">
                    vs {game.opponentName} ({game.opponentRating})
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {game.date} • {game.totalMoves} moves • Accuracy: {game.accuracyUser}%
                  </div>
                </div>
              </div>

              <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px]">
                {game.pgn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
