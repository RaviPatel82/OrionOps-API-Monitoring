import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip
} from 'recharts';
import ChartTooltip from './ChartTooltip.jsx';

export default function ThroughputChart({ series }) {
  return (
    <div className="bento-item bento-item-wide p-0 overflow-hidden flex flex-col group">
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/10">
        <div>
          <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest block mb-0.5">Telemetry 01</span>
          <h3 className="text-sm font-bold uppercase tracking-tight">Throughput Velocity (Live)</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Active Stream</span>
        </div>
      </div>
      <div className="h-[280px]">
        {series.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="hitsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 600, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 600, fill: 'var(--color-muted-foreground)' }}
                width={40}
              />
              <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="hits"
                name="Hits"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#hitsFill)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-35">No timeline data</p>
          </div>
        )}
      </div>
    </div>
  );
}
