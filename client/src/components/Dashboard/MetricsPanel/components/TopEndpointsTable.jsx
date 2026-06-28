import React from 'react';
import { Terminal, ArrowUpRight, Layers } from 'lucide-react';
import { formatNumber, formatLatency } from '../../../../utils.js';
import { cn } from '@/lib/utils';

export default function TopEndpointsTable({ topEndpoints }) {
  return (
    <div className="relative bento-item w-full p-0 overflow-hidden">
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/10">
        <div>
          <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-[0.15em] block mb-0.5">Resource Mapping</span>
          <h3 className="text-lg font-bold tracking-tight text-foreground">Top Active Endpoints</h3>
        </div>
        <button className="flex items-center gap-1 text-primary font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-md hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
          Full Map <ArrowUpRight size={12} />
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/5">
              <th className="h-11 text-left font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-6">Resource Path</th>
              <th className="h-11 text-left font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-5">Method</th>
              <th className="h-11 text-left font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-5">Throughput</th>
              <th className="h-11 text-left font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-5">Latency</th>
              <th className="h-11 text-left font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-5">Error Rate</th>
              <th className="h-11 text-right font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em] px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {topEndpoints.slice(0, 5).map((row, i) => {
              const latencyVal = Number(row.avgLatency) || 0;
              const errRate = Number(row.errorRate) || 0;
              return (
                <tr key={i} className="group hover:bg-accent/20 transition-colors duration-150">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md border border-border bg-secondary/30 flex items-center justify-center text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors duration-200 flex-shrink-0">
                        <Terminal size={13} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono font-bold text-[12px] text-foreground tracking-tight truncate">{row.endpoint}</p>
                        <p className="text-[9px] text-muted-foreground font-mono font-semibold uppercase tracking-[0.15em]">{row.serviceName || 'External API'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wide",
                      row.method === 'GET' ? 'text-emerald-400 border border-emerald-500/20 bg-emerald-500/5' :
                        row.method === 'POST' ? 'text-indigo-400 border border-indigo-500/20 bg-indigo-500/5' :
                          row.method === 'PUT' ? 'text-amber-400 border border-amber-500/20 bg-amber-500/5' :
                            row.method === 'DELETE' ? 'text-tech-rose border border-tech-rose/20 bg-tech-rose/5' :
                              'text-muted-foreground border border-border bg-secondary/30'
                    )}>
                      {row.method || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[12px] text-foreground font-mono">{formatNumber(row.totalHits)}</span>
                    <span className="text-[9px] text-muted-foreground font-semibold ml-1">REQ</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "font-bold text-[12px] font-mono",
                      latencyVal > 500 ? "text-tech-rose" : latencyVal > 200 ? "text-amber-400" : "text-foreground"
                    )}>
                      {formatLatency(row.avgLatency)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded",
                      errRate > 50 ? 'text-tech-rose border border-tech-rose/20 bg-tech-rose/5' :
                        errRate > 5 ? 'text-amber-400 border border-amber-500/20 bg-amber-500/5' :
                          'text-emerald-400 border border-emerald-500/20 bg-emerald-500/5'
                    )}>
                      {errRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <span className={cn(
                      "text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase",
                      errRate > 50 ? 'text-tech-rose border border-tech-rose/20 bg-tech-rose/10' :
                        errRate > 5 ? 'text-amber-400 border border-amber-500/20 bg-amber-500/10' :
                          'text-emerald-400 border border-emerald-500/20 bg-emerald-500/10'
                    )}>
                      {errRate > 50 ? 'Critical' : errRate > 5 ? 'Degraded' : 'Active'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {topEndpoints.length === 0 && (
              <tr>
                <td colSpan="6" className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Layers size={40} strokeWidth={1} className="text-muted-foreground opacity-20" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground opacity-30">
                      No active traffic detected
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout (responsive: card layout below md) */}
      <div className="md:hidden divide-y divide-border">
        {topEndpoints.slice(0, 5).map((row, i) => {
          const errRate = Number(row.errorRate) || 0;
          return (
            <div key={i} className="px-4 py-3 hover:bg-accent/20 transition-colors duration-150">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-7 w-7 rounded-md border border-border bg-secondary/30 flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Terminal size={12} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono font-bold text-[11px] text-foreground tracking-tight truncate">{row.endpoint}</p>
                  <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-wider">{row.serviceName || 'External API'}</p>
                </div>
                <span className={cn(
                  "text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0",
                  errRate > 50 ? 'text-tech-rose border border-tech-rose/20 bg-tech-rose/10' :
                    errRate > 5 ? 'text-amber-400 border border-amber-500/20 bg-amber-500/10' :
                      'text-emerald-400 border border-emerald-500/20 bg-emerald-500/10'
                )}>
                  {errRate > 50 ? 'Critical' : errRate > 5 ? 'Degraded' : 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-4 ml-10">
                <div>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">Method</span>
                  <span className="text-[11px] font-mono font-bold text-foreground">{row.method || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">Traffic</span>
                  <span className="text-[11px] font-mono font-bold text-foreground">{formatNumber(row.totalHits)}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">Latency</span>
                  <span className="text-[11px] font-mono font-bold text-foreground">{formatLatency(row.avgLatency)}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">Errors</span>
                  <span className="text-[11px] font-mono font-bold text-foreground">{errRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
        {topEndpoints.length === 0 && (
          <div className="py-16 text-center">
            <Layers size={32} strokeWidth={1} className="text-muted-foreground opacity-20 mx-auto mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-30">No traffic</p>
          </div>
        )}
      </div>
    </div>
  );
}
