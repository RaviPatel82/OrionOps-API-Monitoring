import React from 'react';
import { formatNumber } from '../../../../utils.js';

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border shadow-2xl p-3 rounded-md text-xs font-mono">
      <p className="font-bold text-muted-foreground/80 mb-2 uppercase tracking-[0.15em] text-[9px] border-b border-border/50 pb-1.5">
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-6 mb-0.5 last:mb-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-foreground text-[10px] uppercase tracking-wider">{p.name}</span>
          </div>
          <span className="font-bold text-primary">{formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
