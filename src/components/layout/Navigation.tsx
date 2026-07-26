import React from 'react';
import { Play, Target, Cpu, BookOpen, ShieldAlert, Edit3, User, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

export type NavTab =
  | 'play'
  | 'puzzles'
  | 'analysis'
  | 'openings'
  | 'endgames'
  | 'editor'
  | 'profile'
  | 'settings';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenDiagnostics: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onOpenDiagnostics }) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'play', label: 'Play Chess', icon: Play },
    { id: 'puzzles', label: 'Puzzles', icon: Target },
    { id: 'analysis', label: 'Analysis', icon: Cpu },
    { id: 'openings', label: 'Openings', icon: BookOpen },
    { id: 'endgames', label: 'Endgames', icon: ShieldAlert },
    { id: 'editor', label: 'Board Editor', icon: Edit3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-600/30">
            ♟️
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-100 tracking-tight">Chess Platform</h1>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">100% Offline Engine</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-600/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Diagnostics / Test Suite Button */}
      <div className="pt-4 border-t border-slate-800/80 hidden lg:block">
        <button
          onClick={onOpenDiagnostics}
          className="w-full flex items-center justify-center gap-2 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-semibold transition"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Self Diagnostics</span>
        </button>
      </div>
    </aside>
  );
};
