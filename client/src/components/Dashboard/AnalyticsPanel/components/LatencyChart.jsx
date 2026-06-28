import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip
} from 'recharts';
import ChartTooltip from './ChartTooltip.jsx';

export default function LatencyChart({ series }) {
  return (
    <div className="bento-item bento-item-wide p-0 overflow-hidden flex flex-col group hover:border-indigo-500/30">
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-indigo-500/5">
        <div>
          <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Telemetry 02</span>
          <h3 className="text-sm font-bold uppercase tracking-tight">Mean Latency Over Time</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Live latency</span>
        </div>
      </div>
      <div className="h-[280px]">
        {series.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
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
              <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-accent)', opacity: 0.1 }} />
              <Bar dataKey="avgLatency" name="Latency (ms)" fill="#818cf8" radius={[3, 3, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-35">No latency data</p>
          </div>
        )}
      </div>
    </div>
  );
}
