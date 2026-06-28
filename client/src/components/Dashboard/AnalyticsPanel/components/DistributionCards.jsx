import React from 'react';
import { PieChart, BarChart4, Server, Info, Clock } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { formatNumber, formatLatency } from '../../../../utils.js';

export default function DistributionCards({ methodStats, responseStatusBreakdown, dbData }) {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Method Distribution */}
      <div className="bento-item p-6 flex flex-col justify-between group">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
            <PieChart size={14} className="group-hover:text-primary transition-colors" /> Method Breakdown
          </h4>
          <div className="h-[180px] mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={methodStats}
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {methodStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(val) => [`${val} requests`, 'Count']} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider">REST</span>
              <span className="text-md font-bold font-mono">FLOW</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5 mt-4 pt-3 border-t border-border">
          {methodStats.map((m) => (
            <div key={m.name} className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.fill }} />
                <span className="text-muted-foreground">{m.name}</span>
              </div>
              <span className="font-bold text-foreground">{formatNumber(m.value)} Hits</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Code segments */}
      <div className="bento-item p-6 flex flex-col justify-between group">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
            <BarChart4 size={14} className="group-hover:text-primary transition-colors" /> HTTP Code Segments
          </h4>
          <div className="h-[180px] mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={responseStatusBreakdown}
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {responseStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(val) => [`${val} responses`, 'Count']} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider">HTTP</span>
              <span className="text-md font-bold font-mono">CODE</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5 mt-4 pt-3 border-t border-border">
          {responseStatusBreakdown.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.fill }} />
                <span className="text-muted-foreground">{s.name}</span>
              </div>
              <span className="font-bold text-foreground">{formatNumber(s.value)} Hits</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected client services summary */}
      <div className="bento-item p-6 flex flex-col justify-between group">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
            <Server size={14} className="group-hover:text-primary transition-colors" /> Loaded Services
          </h4>
          <div className="space-y-3.5 mt-4 overflow-y-auto max-h-[220px]">
            {(dbData?.topEndpoints || []).reduce((acc, current) => {
              const existing = acc.find(item => item.name === (current.serviceName || 'External API'));
              if (existing) {
                existing.hits += current.totalHits;
                existing.latency = Math.max(existing.latency, Number(current.avgLatency) || 0);
              } else {
                acc.push({
                  name: current.serviceName || 'External API',
                  hits: current.totalHits,
                  latency: Number(current.avgLatency) || 0
                });
              }
              return acc;
            }, []).map((srv, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded bg-secondary/80 border border-border flex items-center justify-center flex-shrink-0 text-muted-foreground font-mono text-[9px] font-bold">
                  S0{idx + 1}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-foreground truncate block mr-1">{srv.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold flex-shrink-0">
                      {formatNumber(srv.hits)} req
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[9px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> Max Latency:
                    </span>
                    <span className="font-mono text-foreground font-semibold">{formatLatency(srv.latency)}</span>
                  </div>
                </div>
              </div>
            ))}
            {(dbData?.topEndpoints || []).length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground opacity-30">
                No active client services.
              </div>
            )}
          </div>
        </div>
        <div className="pt-3 border-t border-border mt-4 text-[9px] font-medium text-muted-foreground uppercase flex items-center gap-1 opacity-55">
          <Info size={11} /> Load share calculated from ingress headers.
        </div>
      </div>
    </div>
  );
}
