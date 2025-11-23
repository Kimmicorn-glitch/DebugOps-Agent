import React, { useState, useEffect } from 'react';

// Mock Component for displaying Performance Metrics 
// In a real scenario, this would fetch data from the Sentry Stats API
export const SystemHealth: React.FC = () => {
  const [metrics, setMetrics] = useState({
    latency: 120,
    throughput: 450,
    errorRate: 0.2,
    apdex: 0.98
  });

  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        latency: Math.max(50, prev.latency + (Math.random() - 0.5) * 40),
        throughput: Math.max(100, prev.throughput + (Math.random() - 0.5) * 50),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.1)),
        apdex: Math.max(0.8, Math.min(1.0, prev.apdex + (Math.random() - 0.5) * 0.01))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (val: number, type: 'latency' | 'error' | 'apdex') => {
    if (type === 'latency') return val < 200 ? 'text-emerald-500' : val < 500 ? 'text-yellow-500' : 'text-rose-500';
    if (type === 'error') return val < 1 ? 'text-emerald-500' : val < 5 ? 'text-yellow-500' : 'text-rose-500';
    if (type === 'apdex') return val > 0.95 ? 'text-emerald-500' : val > 0.85 ? 'text-yellow-500' : 'text-rose-500';
    return 'text-ops-text-main';
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-ops-panel border border-ops-border p-3 rounded shadow-sm">
          <div className="text-[10px] text-ops-text-muted uppercase font-bold mb-1">P95 Latency</div>
          <div className={`text-xl font-mono ${getHealthColor(metrics.latency, 'latency')}`}>
            {metrics.latency.toFixed(0)}ms
          </div>
          <div className="w-full bg-ops-border h-1 mt-2 rounded-full overflow-hidden">
             <div className="h-full bg-current opacity-70 transition-all duration-500 text-ops-text-main" style={{ width: `${Math.min(100, metrics.latency / 5)}%` }}></div>
          </div>
        </div>
        <div className="bg-ops-panel border border-ops-border p-3 rounded shadow-sm">
          <div className="text-[10px] text-ops-text-muted uppercase font-bold mb-1">Error Rate</div>
          <div className={`text-xl font-mono ${getHealthColor(metrics.errorRate, 'error')}`}>
            {metrics.errorRate.toFixed(2)}%
          </div>
          <div className="w-full bg-ops-border h-1 mt-2 rounded-full overflow-hidden">
             <div className="h-full bg-current opacity-70 transition-all duration-500 text-ops-text-main" style={{ width: `${Math.min(100, metrics.errorRate * 10)}%` }}></div>
          </div>
        </div>
        <div className="bg-ops-panel border border-ops-border p-3 rounded shadow-sm">
          <div className="text-[10px] text-ops-text-muted uppercase font-bold mb-1">Throughput</div>
          <div className="text-xl font-mono text-blue-500">
            {metrics.throughput.toFixed(0)} rpm
          </div>
        </div>
        <div className="bg-ops-panel border border-ops-border p-3 rounded shadow-sm">
          <div className="text-[10px] text-ops-text-muted uppercase font-bold mb-1">Apdex Score</div>
          <div className={`text-xl font-mono ${getHealthColor(metrics.apdex, 'apdex')}`}>
            {metrics.apdex.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Sentry Integration Info */}
      <div className="p-4 border border-dashed border-ops-border rounded-lg bg-ops-panel/30">
        <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-ops-text-main" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 12c0 4.97 4.03 9 9 9 1.5 0 2.91-.39 4.14-1.07l-1.89-2.31c-.68.25-1.41.38-2.25.38-3.31 0-6-2.69-6-6s2.69-6 6-6c2.72 0 5.03 1.8 5.75 4.29l2.45-1.04C18.17 5.07 14.88 2 11 2 5.48 2 1 6.48 1 12zm13.19 2.53l-1.85-2.27 1.85-2.27 2.27 1.85-2.27 2.69z"/>
                <path d="M15.19 14.53l-1.85-2.27 1.85-2.27 2.27 1.85-2.27 2.69z" fill="none"/>
            </svg>
            <div>
                <h4 className="text-sm font-bold text-ops-text-main">Sentry Monitoring Active</h4>
                <p className="text-xs text-ops-text-muted">Exceptions are automatically captured and sent to your project.</p>
            </div>
        </div>
        <div className="text-[10px] text-ops-text-dim font-mono mt-2">
            SDK Version: 8.0.0 (React)
        </div>
      </div>
    </div>
  );
};