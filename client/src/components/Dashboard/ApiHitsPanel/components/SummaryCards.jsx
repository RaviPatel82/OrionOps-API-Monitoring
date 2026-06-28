import React from "react";
import { Activity, CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber, formatLatency } from "../../../../utils.js";

export default function SummaryCards({ stats }) {
  const cards = [
    { icon: Activity, label: "Total Requests", value: formatNumber(stats.total), sub: "Filtered Results", accent: "primary" },
    { icon: CheckCircle2, label: "Successful", value: formatNumber(stats.success), sub: "2xx + 3xx Responses", accent: "emerald" },
    { icon: AlertTriangle, label: "Errors", value: formatNumber(stats.errors), sub: "4xx + 5xx", accent: "rose" },
    { icon: Zap, label: "Avg Latency", value: formatLatency(stats.avgLatency), sub: "Mean Response Time", accent: "amber" },
  ];

  return (
    <div className="relative bento-grid mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bento-item flex flex-col justify-between group overflow-hidden relative"
        >
          {/* Subtle background glow */}
          <div className={cn(
            "absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[40px] opacity-20 transition-opacity duration-500 group-hover:opacity-40",
            card.accent === "emerald" ? "bg-emerald-500" :
              card.accent === "rose" ? "bg-tech-rose" :
                card.accent === "amber" ? "bg-amber-500" : "bg-primary"
          )} />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {card.label}
              </span>
              <div className="p-2 rounded-lg border border-border/50 bg-secondary/30 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <card.icon size={16} strokeWidth={2} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h3 className={cn(
              "text-4xl font-bold tracking-tighter leading-none",
              card.accent === "rose" ? "text-tech-rose" : "text-foreground"
            )}>
              {card.value}
            </h3>
          </div>
          <p className="relative z-10 text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-4 pt-3 border-t border-border/50 opacity-60">
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
