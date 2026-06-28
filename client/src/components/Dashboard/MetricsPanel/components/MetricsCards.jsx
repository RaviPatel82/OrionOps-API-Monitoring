import React from 'react';
import { Activity, Users, Timer, AlertTriangle } from 'lucide-react';
import { formatNumber, formatLatency } from '../../../../utils.js';
import { cn } from '@/lib/utils';

export default function MetricsCards({ stats, errorRate }) {
  const cards = [
    {
      label: "Total Traffic",
      value: formatNumber(stats?.totalHits),
      unit: "Hits",
      sub: "System-wide Inbound",
      icon: Activity,
      accent: "primary",
    },
    {
      label: "Unique Clients",
      value: formatNumber(stats?.uniqueServices),
      unit: "Services",
      sub: `${formatNumber(stats?.uniqueEndpoints)} API Endpoints`,
      icon: Users,
      accent: "emerald",
    },
    {
      label: "Response Time",
      value: formatLatency(stats?.avgLatency),
      unit: "avg",
      sub: "Mean Processing Latency",
      icon: Timer,
      accent: "amber",
    },
    {
      label: "System Errors",
      value: formatNumber(stats?.errorHits),
      unit: `${errorRate}%`,
      sub: "Active Exception Velocity",
      icon: AlertTriangle,
      accent: "rose",
    },
  ];

  return (
    <div className="relative bento-grid">
      {cards.map((card) => {
        const accentMap = {
          primary: { icon: "text-primary bg-primary/5", hover: "hover:border-primary/50", valueColor: "text-foreground" },
          emerald: { icon: "text-emerald-400 bg-emerald-500/5", hover: "hover:border-emerald-500/30", valueColor: "text-foreground" },
          amber: { icon: "text-amber-400 bg-amber-500/5", hover: "hover:border-amber-400/30", valueColor: "text-foreground" },
          rose: { icon: "text-tech-rose bg-tech-rose/5", hover: "hover:border-tech-rose/30", valueColor: "text-tech-rose" },
        };
        const a = accentMap[card.accent];

        return (
          <div
            key={card.label}
            className={cn(
              "bento-item flex flex-col justify-between group relative overflow-hidden",
              a.hover
            )}
          >
            {/* Subtle background glow */}
            <div className={cn("absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[40px] opacity-20 transition-opacity duration-500 group-hover:opacity-40", card.accent === 'rose' ? 'bg-tech-rose' : card.accent === 'amber' ? 'bg-tech-amber' : card.accent === 'emerald' ? 'bg-tech-emerald' : 'bg-primary')} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em]",
                  card.accent === "rose" ? "text-tech-rose" : "text-muted-foreground group-hover:text-foreground/80 transition-colors"
                )}>
                  {card.label}
                </span>
                <div className={cn("p-2 rounded-lg border border-border/50 shadow-sm transition-transform duration-300 group-hover:scale-110", a.icon)}>
                  <card.icon size={16} strokeWidth={2} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className={cn("text-4xl font-bold tracking-tighter leading-none", a.valueColor)}>
                  {card.value}
                </h2>
                <span className={cn(
                  "text-[10px] font-mono font-bold uppercase tracking-widest",
                  card.accent === "rose" ? "text-tech-rose opacity-80" : "text-muted-foreground"
                )}>
                  {card.unit}
                </span>
              </div>
            </div>
            <p className="relative z-10 text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-5 pt-4 border-t border-border/50 opacity-60">
              {card.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
