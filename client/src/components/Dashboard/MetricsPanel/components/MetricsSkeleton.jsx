import React from 'react';

export default function MetricsSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto bg-background bg-grid-pattern min-h-full relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] pointer-events-none" />

      {/* Header skeleton */}
      <div className="relative flex flex-col gap-1.5 border-l-[3px] border-border pl-5 animate-pulse mb-8 z-10">
        <div className="h-6 w-48 rounded bg-border" />
        <div className="h-3.5 w-96 rounded bg-border mt-1" />
      </div>

      {/* Stat cards skeleton */}
      <div className="relative bento-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bento-item flex flex-col justify-between animate-pulse">
            <div className="flex justify-between items-start">
              <div className="h-2.5 w-20 rounded bg-border" />
              <div className="h-8 w-8 rounded-lg bg-border/50" />
            </div>
            <div className="h-8 w-28 rounded bg-border mt-6 mb-4" />
            <div className="h-px w-full bg-border/50" />
            <div className="h-2 w-32 rounded bg-border/50 mt-4" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="relative bento-grid">
        <div className="bento-item bento-item-wide p-0 overflow-hidden animate-pulse">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div>
              <div className="h-2 w-16 rounded bg-border mb-2" />
              <div className="h-4 w-36 rounded bg-border" />
            </div>
          </div>
          <div className="p-5 h-[280px] flex items-end gap-1.5">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex-1 bg-border/40 rounded-t" style={{ height: `${20 + Math.random() * 60}%` }} />
            ))}
          </div>
        </div>
        <div className="bento-item bento-item-wide p-0 overflow-hidden animate-pulse">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div>
              <div className="h-2 w-16 rounded bg-border mb-2" />
              <div className="h-4 w-36 rounded bg-border" />
            </div>
          </div>
          <div className="p-5 h-[280px] flex items-end gap-1.5">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex-1 bg-border/40 rounded-t" style={{ height: `${20 + Math.random() * 60}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="relative bento-item w-full p-0 overflow-hidden animate-pulse">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div>
            <div className="h-2 w-24 rounded bg-border mb-2" />
            <div className="h-5 w-40 rounded bg-border" />
          </div>
          <div className="h-7 w-20 rounded bg-border" />
        </div>
        <div className="px-6 pb-6">
          <div className="h-11 border-b border-border/50" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-border/50 last:border-0">
              <div className="h-8 w-8 rounded-md bg-border" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-48 rounded bg-border" />
                <div className="h-2 w-20 rounded bg-border/50" />
              </div>
              <div className="h-3 w-16 rounded bg-border" />
              <div className="h-3 w-12 rounded bg-border" />
              <div className="h-4 w-14 rounded bg-border/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
