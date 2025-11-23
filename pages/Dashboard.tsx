import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorCard } from '../components/ErrorCard';
import { AgentTimeline } from '../components/AgentTimeline';
import { PatchPreview } from '../components/PatchPreview';
import { SettingsModal } from '../components/SettingsModal';
import { SystemHealth } from '../components/SystemHealth';
import { NewIncidentModal } from '../components/NewIncidentModal';
import { analyzeErrorWithGemini } from '../services/geminiService';
import * as SentryService from '../services/sentryService';
import * as db from '../services/db';
import * as auth from '../services/authService';
import { MOCK_ERRORS } from '../constants';
import { AppError, ErrorStatus } from '../types';

type SidebarTab = 'incidents' | 'health';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Settings State with Persistence
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('debugOps_apiKey') || process.env.API_KEY || '');
  const [sentryDsn, setSentryDsn] = useState<string>(() => localStorage.getItem('debugOps_sentryDsn') || '');
  const [refreshInterval, setRefreshInterval] = useState<number>(() => parseInt(localStorage.getItem('debugOps_refreshInterval') || '5000'));
  const [autoAnalyze, setAutoAnalyze] = useState<boolean>(() => localStorage.getItem('debugOps_autoAnalyze') === 'true');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // User State
  const [user, setUser] = useState(auth.getCurrentUser());

  // Incident Modal State
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // App State
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [errors, setErrors] = useState<AppError[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('incidents');
  // Force update to trigger re-renders from mock db listeners
  const [, setTick] = useState(0);

  // Auth Check
  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('debugOps_apiKey', apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem('debugOps_sentryDsn', sentryDsn); }, [sentryDsn]);
  useEffect(() => { localStorage.setItem('debugOps_refreshInterval', refreshInterval.toString()); }, [refreshInterval]);
  useEffect(() => { localStorage.setItem('debugOps_autoAnalyze', String(autoAnalyze)); }, [autoAnalyze]);

  // Sentry Initialization
  useEffect(() => {
    if (sentryDsn) {
      SentryService.initSentry(sentryDsn);
    }
  }, [sentryDsn]);

  // Initial Check
  useEffect(() => {
    if (!apiKey) {
      setIsSettingsOpen(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync with Mock DB
  useEffect(() => {
    const unsub = db.subscribeToData(() => {
      setErrors(db.getErrors());
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  // Derived state
  const selectedError = errors.find(e => e.id === selectedErrorId);
  const logs = selectedErrorId ? db.getLogs(selectedErrorId) : [];
  const patch = selectedErrorId ? db.getPatch(selectedErrorId) : undefined;

  const handleRunAgent = async (targetError?: AppError) => {
    const errorToProcess = targetError || selectedError;
    if (!errorToProcess || !apiKey) return;
    
    // 1. Update Status
    db.updateErrorStatus(errorToProcess.id, ErrorStatus.ANALYZING);
    
    // 2. Log: Start
    db.addLog({
      errorId: errorToProcess.id,
      step: 'Initialized Agent',
      description: 'Agent received incident report. Beginning triage.',
      status: 'success'
    });

    try {
      // 3. Log: Reading
      await new Promise(r => setTimeout(r, 800)); // Fake delay for realism
      db.addLog({
        errorId: errorToProcess.id,
        step: 'Log Analysis',
        description: `Parsing context from ${errorToProcess.sourceFile}...`,
        status: 'success'
      });

      // 4. Call Gemini
      db.addLog({
        errorId: errorToProcess.id,
        step: 'Querying Gemini 2.0',
        description: 'Sending context to LLM for root cause analysis.',
        status: 'pending'
      });
      
      const solution = await analyzeErrorWithGemini(errorToProcess, apiKey);
      
      // 5. Log: Solution found
      db.addLog({
        errorId: errorToProcess.id,
        step: 'Analysis Complete',
        description: 'Root cause identified. Solution proposed.',
        status: 'success'
      });

      // 6. Save Patch
      db.savePatch(errorToProcess.id, solution);

    } catch (err) {
      db.addLog({
        errorId: errorToProcess.id,
        step: 'Analysis Failed',
        description: 'Could not generate patch. See console.',
        status: 'failed'
      });
      console.error(err);
      db.updateErrorStatus(errorToProcess.id, ErrorStatus.OPEN);
      SentryService.captureError(err as Error, { context: "Gemini Analysis" });
    }
  };

  const handleSimulateError = () => {
    const randomTemplate = MOCK_ERRORS[Math.floor(Math.random() * MOCK_ERRORS.length)];
    const newErr = db.addError(randomTemplate);
    
    if (sentryDsn) {
      const mockException = new Error(randomTemplate.message);
      mockException.stack = randomTemplate.stackTrace;
      SentryService.captureError(mockException, { 
        file: randomTemplate.sourceFile,
        simulated: true 
      });
    }

    setSelectedErrorId(newErr.id);
    setActiveTab('incidents');

    if (autoAnalyze && apiKey) {
      handleRunAgent(newErr);
    }
  };

  const handleNewIncident = (errorData: Omit<AppError, 'id' | 'timestamp' | 'status'>) => {
    const newErr = db.addError(errorData);
    setSelectedErrorId(newErr.id);
    setActiveTab('incidents');
    
    if (autoAnalyze && apiKey) {
      handleRunAgent(newErr);
    }
  };

  const handleApplyPatch = async () => {
    if (!selectedErrorId) return;
    setIsApplying(true);

    await new Promise(r => setTimeout(r, 2000));

    db.addLog({
      errorId: selectedErrorId,
      step: 'Applying Patch',
      description: 'Deploying fix to production environment...',
      status: 'success'
    });

    db.updateErrorStatus(selectedErrorId, ErrorStatus.RESOLVED);
    
    db.addLog({
      errorId: selectedErrorId,
      step: 'Resolved',
      description: 'Patch verification successful. Incident closed.',
      status: 'success'
    });
    
    setIsApplying(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-ops-bg text-slate-300 font-sans selection:bg-ops-accent selection:text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-ops-border bg-ops-bg flex items-center justify-between px-6 z-10 shadow-lg relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            D
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">DebugOps</h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="mr-4 flex items-center gap-2 px-3 py-1 bg-ops-panel rounded-full border border-ops-border">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-600"></div>
            )}
            <span className="text-xs text-slate-400 font-medium">{user.displayName}</span>
          </div>

          <button 
            onClick={() => setIsIncidentModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            MANUAL INPUT
          </button>

          <button 
            onClick={handleSimulateError}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-lg transition-colors flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            SIMULATE RANDOM
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-ops-panel rounded-lg transition-colors border border-transparent hover:border-ops-border ml-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-ops-panel rounded-lg transition-colors border border-transparent hover:border-ops-border"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-grow p-4 overflow-hidden relative">
        <div className="grid grid-cols-12 gap-4 h-full max-w-[1920px] mx-auto">
          
          {/* Column 1: Incident Feed & Health */}
          <section className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col bg-ops-panel/20 rounded-xl border border-ops-border overflow-hidden backdrop-blur-sm">
            
            {/* Tabs */}
            <div className="flex border-b border-ops-border">
                <button 
                  onClick={() => setActiveTab('incidents')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'incidents' ? 'text-ops-accent border-ops-accent bg-ops-panel/60' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                >
                  Incidents
                </button>
                <button 
                  onClick={() => setActiveTab('health')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'health' ? 'text-ops-accent border-ops-accent bg-ops-panel/60' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                >
                  System Health
                </button>
            </div>

            <div className="flex-grow overflow-y-auto relative">
              {activeTab === 'incidents' ? (
                 <div className="p-3">
                   {errors.length === 0 ? (
                     <div className="h-64 flex flex-col items-center justify-center text-slate-600 space-y-2">
                       <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                       </div>
                       <p className="text-sm">All systems operational</p>
                     </div>
                   ) : (
                     errors.map(error => (
                       <ErrorCard 
                         key={error.id} 
                         error={error} 
                         isSelected={error.id === selectedErrorId}
                         onClick={() => setSelectedErrorId(error.id)}
                       />
                     ))
                   )}
                 </div>
              ) : (
                <SystemHealth />
              )}
            </div>
            
            {activeTab === 'incidents' && (
               <div className="p-2 border-t border-ops-border bg-ops-panel/30 text-center">
                 <span className="text-[10px] font-mono text-slate-500">{errors.length} Active Incidents</span>
               </div>
            )}
          </section>

          {/* Column 2: Agent Timeline */}
          <section className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col bg-ops-panel/20 rounded-xl border border-ops-border overflow-hidden backdrop-blur-sm relative">
            <div className="p-4 border-b border-ops-border bg-ops-panel/40">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Agent Command Center</h2>
            </div>
            <div className="flex-grow overflow-hidden relative">
              {selectedErrorId ? (
                <>
                  <AgentTimeline logs={logs} />
                  {/* Manual Trigger Button (if not started) */}
                  {selectedError?.status === ErrorStatus.OPEN && (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                      <button 
                        onClick={() => handleRunAgent()}
                        className="bg-ops-accent hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Deploy Agent
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <p className="text-sm">Select an incident to view agent telemetry</p>
                </div>
              )}
            </div>
          </section>

          {/* Column 3: Patch Preview */}
          <section className="col-span-12 md:col-span-4 lg:col-span-5 flex flex-col bg-ops-panel/20 rounded-xl border border-ops-border overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-ops-border bg-ops-panel/40">
               <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Patch Solution</h2>
            </div>
            <div className="flex-grow overflow-hidden">
               {selectedErrorId ? (
                 <PatchPreview 
                   patch={patch} 
                   onApply={handleApplyPatch}
                   isApplying={isApplying}
                 />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600">
                   <p className="text-sm">Waiting for analysis...</p>
                 </div>
               )}
            </div>
          </section>

        </div>
      </main>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        sentryDsn={sentryDsn}
        setSentryDsn={setSentryDsn}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
        autoAnalyze={autoAnalyze}
        setAutoAnalyze={setAutoAnalyze}
      />
      
      <NewIncidentModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        onSubmit={handleNewIncident}
      />
    </div>
  );
};