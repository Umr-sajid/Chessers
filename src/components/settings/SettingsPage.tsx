import React from 'react';
import { AppSettings, BoardTheme, PieceStyle, AppTheme } from '../../types/chess';
import { Settings as SettingsIcon, Sliders, Volume2, Shield, Eye, Palette } from 'lucide-react';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings }) => {
  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Preferences & Customization</h2>
            <p className="text-xs text-slate-400">Customize board theme, sound synthesis, engine calculation speed, and highlights</p>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="flex flex-col gap-5">
        {/* Board Appearance */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Board & Piece Appearance</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Board Color Scheme</label>
              <select
                value={settings.boardTheme}
                onChange={(e) => handleChange('boardTheme', e.target.value as BoardTheme)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none"
              >
                <option value="green">Classic Green & White</option>
                <option value="wood">Warm Wooden Timber</option>
                <option value="slate">Slate Navy</option>
                <option value="cyber">Cyber Neon</option>
                <option value="ice">Ice Blue</option>
                <option value="charcoal">Charcoal Dark</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Piece Style</label>
              <select
                value={settings.pieceStyle}
                onChange={(e) => handleChange('pieceStyle', e.target.value as PieceStyle)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none"
              >
                <option value="neo">Neo Standard</option>
                <option value="alpha">Alpha Clean</option>
                <option value="glass">Glass Reflection</option>
                <option value="wood">Carved Wood</option>
                <option value="minimal">Minimal Flat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Board Helpers & Overlay Toggles */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-400" />
            <span>Visual Overlays & Move Assistance</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <span className="font-semibold text-slate-300">Show Evaluation Bar</span>
              <input
                type="checkbox"
                checked={settings.showEvalBar}
                onChange={(e) => handleChange('showEvalBar', e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <span className="font-semibold text-slate-300">Legal Move Dots</span>
              <input
                type="checkbox"
                checked={settings.showLegalMoves}
                onChange={(e) => handleChange('showLegalMoves', e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <span className="font-semibold text-slate-300">Board Coordinates (A-H, 1-8)</span>
              <input
                type="checkbox"
                checked={settings.showCoordinates}
                onChange={(e) => handleChange('showCoordinates', e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <span className="font-semibold text-slate-300">Auto-Promote to Queen</span>
              <input
                type="checkbox"
                checked={settings.autoQueen}
                onChange={(e) => handleChange('autoQueen', e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Audio Synthesis Settings */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Audio Sound Effects</span>
          </h3>

          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-xs font-semibold text-slate-300">Enable Web Audio Sound Effects</span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleChange('soundEnabled', e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
