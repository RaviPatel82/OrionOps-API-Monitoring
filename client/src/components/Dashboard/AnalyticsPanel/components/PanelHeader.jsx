import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function PanelHeader({ isGuest, setRefreshTrigger, error }) {
  return (
    <>
      <div className="relative flex items-center justify-between border-l-[3px] border-primary pl-5 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-foreground flex items-center gap-2">
            System Telemetry & Analytics
            {isGuest && (
              <span className="text-[9px] font-mono font-bold text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 rounded uppercase tracking-wider">
                Demo Simulator
              </span>
            )}
          </h1>
          <p className="text-[13px] font-medium text-muted-foreground max-w-2xl opacity-75 mt-0.5">
            Volumetric analysis, method flow routing, exception velocity, and latency performance charts.
          </p>
        </div>
        <button
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-secondary/30 text-xs font-semibold hover:border-primary hover:text-primary transition-all cursor-pointer"
        >
          <RefreshCw size={12} className="animate-spin-slow" /> Sync Now
        </button>
      </div>

      {error && (
        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-md flex items-start gap-3">
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">Telemetry System Error</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </>
  );
}
