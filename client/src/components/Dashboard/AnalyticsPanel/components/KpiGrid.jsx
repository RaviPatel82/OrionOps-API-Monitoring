import React from 'react';
import { Activity, AlertTriangle, Timer, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatLatency } from '../../../../utils.js';

export default function KpiGrid({ stats, displayErrorRate, latencyGrade }) {
  const kpis = [
    {
      label: "Request Volumetric",
      value: formatNumber(stats?.totalHits),
      unit: "Hits",
      sub: `${formatNumber(stats?.successHits)} success / ${formatNumber(stats?.errorHits)} error`,
      icon: Activity,
      color: "border-primary/20 hover:border-primary/50"
    },
    {
      label: "Failure Rate",
      value: `${displayErrorRate}%`,
      unit: "Ratio",
      sub: Number(displayErrorRate) > 2 ? "High Exception Density" : "System Core Optimal",
      icon: AlertTriangle,
      color: Number(displayErrorRate) > 2 ? "border-red-500/20 hover:border-red-500/50" : "border-border hover:border-primary/30"
    },
    {
      label: "Response Velocity",
      value: formatLatency(stats?.avgLatency),
      unit: "avg",
      sub: latencyGrade.label,
      icon: Timer,
      color: latencyGrade.anomalous ? "border-red-500/20 hover:border-red-500/50" : "border-border hover:border-primary/30",
      valColor: latencyGrade.color
    },
    {
      label: "Service Mapping",
      value: formatNumber(stats?.uniqueServices),
      unit: "Endpoints",
      sub: `${formatNumber(stats?.uniqueEndpoints)} HTTP API Paths`,
      icon: Server,
      color: "border-border hover:border-primary/30"
    }
  ];

  return (
    <div className="relative bento-grid mb-8">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className={cn(
            "bento-item flex flex-col justify-between group relative overflow-hidden",
            kpi.color
          )}
        >
          {/* Subtle background glow */}
          <div className={cn("absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[40px] opacity-20 transition-opacity duration-500 group-hover:opacity-40", idx === 1 ? 'bg-tech-rose' : idx === 2 ? 'bg-tech-amber' : 'bg-primary')} />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {kpi.label}
              </span>
              <div className="p-2 rounded-lg border border-border/50 bg-secondary/30 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <kpi.icon size={16} strokeWidth={2} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className={cn("text-4xl font-bold tracking-tighter leading-none", kpi.valColor || "text-foreground")}>
                {kpi.value}
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                {kpi.unit}
              </span>
            </div>
          </div>
          <p className="relative z-10 text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-5 pt-4 border-t border-border/50 opacity-60">
            {kpi.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
