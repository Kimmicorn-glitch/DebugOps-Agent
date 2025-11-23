import React from 'react';
import { AgentLog } from '../types';

interface AgentTimelineProps {
  logs: AgentLog[];
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-ops-text-dim opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <span className="text-sm">Agent Offline</span>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-ops-text-muted mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Agent Activity
      </h2>
      
      {logs.map((log, idx) => (
        <div key={log.id} className="relative pl-6 border-l border-ops-border last:border-0">
          <div className={`
            absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-ops-bg
            ${log.status === 'success' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}
          `}></div>
          
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-xs font-mono text-ops-text-dim mb-1">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className="text-sm font-semibold text-ops-text-main mb-1">
              {log.step}
            </span>
            <p className="text-xs text-ops-text-muted bg-ops-panel/80 p-2 rounded border border-ops-border/50">
              {log.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};