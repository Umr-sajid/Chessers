import React, { useState } from 'react';
import { Navigation, NavTab } from './components/layout/Navigation';
import { PlayPage } from './components/game/PlayPage';
import { PuzzlePage } from './components/puzzles/PuzzlePage';
import { AnalysisPage } from './components/analysis/AnalysisPage';
import { OpeningPage } from './components/openings/OpeningPage';
import { EndgamePage } from './components/endgames/EndgamePage';
import { PositionEditorPage } from './components/editor/PositionEditorPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { DiagnosticsModal } from './components/testing/DiagnosticsModal';
import { loadSettings, saveSettings } from './utils/storage';
import { AppSettings } from './types/chess';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('play');
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className={`min-h-screen ${settings.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} font-sans flex flex-col lg:flex-row antialiased selection:bg-emerald-500 selection:text-slate-950`}>
      {/* Navigation Sidebar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDiagnostics={() => setShowDiagnostics(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
        {activeTab === 'play' && <PlayPage settings={settings} />}
        {activeTab === 'puzzles' && <PuzzlePage settings={settings} />}
        {activeTab === 'analysis' && <AnalysisPage settings={settings} />}
        {activeTab === 'openings' && <OpeningPage settings={settings} />}
        {activeTab === 'endgames' && <EndgamePage settings={settings} />}
        {activeTab === 'editor' && <PositionEditorPage settings={settings} />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'settings' && (
          <SettingsPage settings={settings} onUpdateSettings={handleUpdateSettings} />
        )}
      </main>

      {/* Diagnostics / Test Suite Modal */}
      {showDiagnostics && <DiagnosticsModal onClose={() => setShowDiagnostics(false)} />}
    </div>
  );
}
