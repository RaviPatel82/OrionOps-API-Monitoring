import React from 'react';

export default function MetricsHeader() {
  return (
    <div className="relative flex flex-col gap-1 border-l-[3px] border-primary pl-5 mb-8">
      <h1 className="text-2xl font-bold tracking-tighter text-foreground">Performance Metrics</h1>
      <p className="text-[13px] font-medium text-muted-foreground max-w-2xl opacity-75">
        Real-time telemetry and ingestion metrics for your production infrastructure.
      </p>
    </div>
  );
}
