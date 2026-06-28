import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import ChartTooltip from './ChartTooltip.jsx';

export default function MetricsCharts({ series }) {
  return (
    <div className="relative bento-grid">
      {/* Success Throughput — Area chart */}
      <div className="bento-item bento-item-wide p-0 overflow-hidden flex flex-col group">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/10">
          <div>
            <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-[0.15em] block mb-0.5">Telemetry 01</span>
            <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Success Throughput</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Live</span>
          </div>
        </div>
        <div className="p-5 h-[280px]">
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
                  interval="preserveStartEnd"
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
                  activeDot={{ r: 4, fill: 'var(--color-primary)', stroke: 'var(--color-card)', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-30">No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Velocity — Bar chart */}
      <div className="bento-item bento-item-wide p-0 overflow-hidden flex flex-col group hover:border-tech-rose/30">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-tech-rose/5">
          <div>
            <span className="text-[9px] font-mono font-bold text-tech-rose uppercase tracking-[0.15em] block mb-0.5">Telemetry 02</span>
            <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Error Velocity</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-tech-rose" />
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Exceptions</span>
          </div>
        </div>
        <div className="p-5 h-[280px]">
          {series.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 600, fill: 'var(--color-muted-foreground)' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 600, fill: 'var(--color-muted-foreground)' }}
                  width={40}
                />
                <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-tech-rose)', opacity: 0.06 }} />
                <Bar dataKey="errors" name="Errors" fill="var(--color-tech-rose)" radius={[3, 3, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-30">No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
