import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  sentryDsn: string;
  setSentryDsn: (dsn: string) => void;
  refreshInterval: number;
  setRefreshInterval: (ms: number) => void;
  autoAnalyze: boolean;
  setAutoAnalyze: (enabled: boolean) => void;
}

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-2 align-middle z-50">
    <svg className="w-4 h-4 text-ops-text-muted hover:text-ops-accent cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900/95 backdrop-blur border border-ops-border text-[10px] leading-tight text-slate-300 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none text-center">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95"></div>
    </div>
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  sentryDsn,
  setSentryDsn,
  refreshInterval,
  setRefreshInterval,
  autoAnalyze,
  setAutoAnalyze
}) => {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handleClearKey = () => {
    if (window.confirm("Are you sure you want to remove the API Key? Agent features will stop working.")) {
      setApiKey('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-ops-panel border border-ops-border p-6 rounded-lg max-w-md w-full shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-ops-border pb-4">
          <h2 className="text-xl font-bold text-ops-text-main flex items-center gap-2">
            <svg className="w-5 h-5 text-ops-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Configuration
          </h2>
          <button onClick={onClose} className="text-ops-text-muted hover:text-ops-text-main transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="mb-6 p-4 bg-ops-bg/50 rounded border border-ops-border flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <span className="block text-sm font-medium text-ops-text-main">Interface Theme</span>
            </div>
            <span className="text-xs text-ops-text-muted">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'light' ? 'bg-ops-accent' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md flex items-center justify-center ${theme === 'light' ? 'left-7' : 'left-1'}`}>
               {theme === 'light' ? (
                 <svg className="w-3 h-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
               ) : (
                 <svg className="w-3 h-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                 </svg>
               )}
            </div>
          </button>
        </div>

        {/* API Key Section */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center">
            <label className="text-xs font-mono font-bold text-ops-text-muted uppercase tracking-wider">
              Gemini API Key
            </label>
            <Tooltip text="Required for the Gemini agent to analyze errors and generate code patches." />
          </div>
          <div className="relative flex gap-2">
            <div className="relative flex-grow">
              <input 
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-ops-bg border border-ops-border rounded p-3 pl-10 text-ops-text-main focus:border-ops-accent outline-none text-sm font-mono transition-colors"
              />
              <svg className="w-4 h-4 text-ops-text-muted absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            {apiKey && (
              <button 
                onClick={handleClearKey}
                className="px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors text-xs font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Sentry DSN Section */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center">
            <label className="text-xs font-mono font-bold text-ops-text-muted uppercase tracking-wider">
              Sentry DSN (Optional)
            </label>
            <Tooltip text="Data Source Name for Sentry.io monitoring. Enables real-time error tracking." />
          </div>
          <div className="relative">
            <input 
              type="text"
              placeholder="https://...@sentry.io/..."
              value={sentryDsn}
              onChange={(e) => setSentryDsn(e.target.value)}
              className="w-full bg-ops-bg border border-ops-border rounded p-3 pl-10 text-ops-text-main focus:border-ops-accent outline-none text-sm font-mono transition-colors"
            />
            <svg className="w-4 h-4 text-ops-text-muted absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-[10px] text-ops-text-dim">
            Paste your client key (DSN) from Sentry Project Settings.
          </p>
        </div>

        {/* Refresh Interval Section */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center">
            <label className="text-xs font-mono font-bold text-ops-text-muted uppercase tracking-wider">
              Data Refresh Interval
            </label>
            <Tooltip text="How frequently the dashboard polls for new error data and agent updates." />
          </div>
          <select 
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="w-full bg-ops-bg border border-ops-border rounded p-3 text-ops-text-main focus:border-ops-accent outline-none text-sm appearance-none cursor-pointer"
          >
            <option value={1000}>1 Second (Realtime)</option>
            <option value={5000}>5 Seconds (Standard)</option>
            <option value={15000}>15 Seconds (Battery Saver)</option>
            <option value={60000}>60 Seconds (Background)</option>
          </select>
        </div>

        {/* Auto Analyze Toggle */}
        <div className="mb-8 p-4 bg-ops-bg/50 rounded border border-ops-border flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <span className="block text-sm font-medium text-ops-text-main">Auto-Analyze Incidents</span>
              <Tooltip text="If enabled, the agent will immediately begin diagnosing new errors as soon as they appear." />
            </div>
            <span className="text-xs text-ops-text-muted">Automatically run agent on new errors</span>
          </div>
          <button 
            onClick={() => setAutoAnalyze(!autoAnalyze)}
            className={`w-12 h-6 rounded-full transition-colors relative ${autoAnalyze ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${autoAnalyze ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-ops-border">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-ops-text-muted hover:text-ops-text-main transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};