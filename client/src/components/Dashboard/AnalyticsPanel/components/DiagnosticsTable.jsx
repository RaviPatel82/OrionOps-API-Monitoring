import React from 'react';
import { cn } from '@/lib/utils';
import { formatNumber, formatLatency } from '../../../../utils.js';

export default function DiagnosticsTable({ dbData, range }) {
  return (
    <div className="relative bento-item w-full p-0 overflow-hidden">
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/10">
        <div>
          <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Telemetry metrics</span>
          <h3 className="text-sm font-bold uppercase tracking-tight">Endpoint Traffic Diagnostics</h3>
        </div>
        <span className="text-[9px] font-mono font-bold text-muted-foreground/50 uppercase tracking-wider">
          Range: {range?.toUpperCase()}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/5">
              <th className="h-11 font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-6">Resource Path</th>
              <th className="h-11 font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-5">Service Scope</th>
              <th className="h-11 font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-5">Throughput Volume</th>
              <th className="h-11 font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-5">Avg Processing latency</th>
              <th className="h-11 font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-5">Performance Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {(dbData?.topEndpoints || []).map((row, i) => {
              const latencyVal = Number(row.avgLatency) || 0;
              const errRate = Number(row.errorRate) || 0;
              
              let perfLabel = 'LAGGING';
              let perfColor = 'text-red-400 border-red-500/20 bg-red-500/5';
              
              if (errRate > 50) {
                perfLabel = 'CRITICAL';
                perfColor = 'text-red-400 border-red-500/20 bg-red-500/5';
              } else if (errRate > 5) {
                perfLabel = 'DEGRADED';
                perfColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
              } else if (latencyVal < 25) {
                perfLabel = 'OPTIMAL';
                perfColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
              } else if (latencyVal < 100) {
                perfLabel = 'GOOD';
                perfColor = 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
              } else if (latencyVal < 1000) {
                perfLabel = 'FAIR';
                perfColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
              }
              
              return (
                <tr key={i} className="group hover:bg-accent/20 transition-colors duration-150">
                  <td className="py-3 px-5 font-mono text-[12px] font-bold text-foreground">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wide mr-2",
                      row.method === 'GET' ? 'text-emerald-400 border border-emerald-500/20 bg-emerald-500/5' :
                        row.method === 'POST' ? 'text-indigo-400 border border-indigo-500/20 bg-indigo-500/5' :
                          row.method === 'PUT' ? 'text-amber-400 border border-amber-500/20 bg-amber-500/5' :
                            row.method === 'DELETE' ? 'text-red-400 border border-red-500/20 bg-red-500/5' :
                              'text-muted-foreground border border-border'
                    )}>
                      {row.method || 'N/A'}
                    </span>
                    {row.endpoint}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground font-semibold uppercase">
                    {row.serviceName || 'External API'}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-foreground font-bold">
                    {formatNumber(row.totalHits)} <span className="text-[9px] text-muted-foreground font-normal">REQ</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-foreground font-bold">
                    {formatLatency(row.avgLatency)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        "text-[9px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap",
                        perfColor
                      )}>
                        {perfLabel}
                      </span>
                      {errRate > 0 && (
                        <span className={cn(
                          "text-[9px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap",
                          errRate > 50 ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                            errRate > 5 ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                              'text-muted-foreground border-border'
                        )}>
                          {errRate.toFixed(1)}% ERR
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {(dbData?.topEndpoints || []).length === 0 && (
              <tr>
                <td colSpan="5" className="py-16 text-center text-xs text-muted-foreground opacity-30">
                  No diagnostics records found for selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
