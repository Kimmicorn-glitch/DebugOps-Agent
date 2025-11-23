import React from 'react';
import { AppError, ErrorStatus } from '../types';

interface ErrorCardProps {
  error: AppError;
  isSelected: boolean;
  onClick: () => void;
}

const statusColors = {
  [ErrorStatus.OPEN]: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  [ErrorStatus.ANALYZING]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  [ErrorStatus.PATCH_PROPOSED]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  [ErrorStatus.RESOLVED]: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        p-4 mb-3 rounded-lg border cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-ops-panel border-ops-accent shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
          : 'bg-ops-panel/50 border-ops-border hover:border-ops-accent/50'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColors[error.status]}`}>
          {error.status}
        </span>
        <span className="text-xs text-slate-500 font-mono">
          {new Date(error.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <h3 className="text-sm font-medium text-slate-200 mb-1 line-clamp-2">
        {error.message}
      </h3>
      
      <p className="text-xs text-slate-500 font-mono truncate">
        {error.sourceFile}
      </p>
    </div>
  );
};
