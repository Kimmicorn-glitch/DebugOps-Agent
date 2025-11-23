import React from 'react';
import { PatchSolution, Severity } from '../types';

interface PatchPreviewProps {
  patch: PatchSolution | undefined;
  onApply: () => void;
  isApplying: boolean;
}

export const PatchPreview: React.FC<PatchPreviewProps> = ({ patch, onApply, isApplying }) => {
  if (!patch) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 border-2 border-dashed border-ops-border rounded-lg m-4">
        <span className="text-sm">No patch generated yet.</span>
        <span className="text-xs opacity-70">Run diagnostics to generate fix.</span>
      </div>
    );
  }

  const severityColor = {
    [Severity.LOW]: 'text-blue-400',
    [Severity.MEDIUM]: 'text-yellow-400',
    [Severity.HIGH]: 'text-orange-400',
    [Severity.CRITICAL]: 'text-red-500',
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded bg-ops-panel border border-ops-border">
          <h4 className="text-xs text-slate-500 uppercase tracking-wide mb-2">Root Cause</h4>
          <p className="text-sm text-slate-200">{patch.root_cause}</p>
        </div>
        <div className="p-4 rounded bg-ops-panel border border-ops-border">
          <h4 className="text-xs text-slate-500 uppercase tracking-wide mb-2">Severity</h4>
          <p className={`text-sm font-bold ${severityColor[patch.severity]}`}>{patch.severity}</p>
        </div>
      </div>

      {/* Explanation */}
      <div>
         <h4 className="text-xs text-slate-500 uppercase tracking-wide mb-2">Agent Explanation</h4>
         <p className="text-sm text-slate-300 leading-relaxed bg-ops-panel/30 p-3 rounded">{patch.explanation}</p>
      </div>

      {/* Code Patch */}
      <div className="flex-grow flex flex-col min-h-[200px]">
        <h4 className="text-xs text-slate-500 uppercase tracking-wide mb-2 flex justify-between">
          <span>Proposed Patch</span>
          <span className="text-slate-400 normal-case font-mono text-[10px]">{patch.files_to_modify.join(', ')}</span>
        </h4>
        <div className="flex-grow bg-[#0d1117] rounded-lg border border-ops-border p-4 font-mono text-xs overflow-x-auto relative group">
          <pre className="text-emerald-400 whitespace-pre-wrap">{patch.patch}</pre>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] bg-slate-700 text-white px-2 py-1 rounded">Diff View</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div>
         <h4 className="text-xs text-slate-500 uppercase tracking-wide mb-2">Recommended Next Steps</h4>
         <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
           {patch.next_steps.map((step, i) => (
             <li key={i}>{step}</li>
           ))}
         </ul>
      </div>

      {/* Actions */}
      <button
        onClick={onApply}
        disabled={isApplying}
        className={`
          w-full py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all
          flex items-center justify-center gap-2
          ${isApplying 
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/20'}
        `}
      >
        {isApplying ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Deploying Patch...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Apply Patch to Production
          </>
        )}
      </button>
    </div>
  );
};
