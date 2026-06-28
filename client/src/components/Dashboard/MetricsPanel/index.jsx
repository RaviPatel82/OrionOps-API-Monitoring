import React, { useMemo } from 'react';
import { bucketHitsByTime } from '../../../utils.js';
import MetricsSkeleton from './components/MetricsSkeleton.jsx';
import MetricsHeader from './components/MetricsHeader.jsx';
import MetricsCards from './components/MetricsCards.jsx';
import MetricsCharts from './components/MetricsCharts.jsx';
import TopEndpointsTable from './components/TopEndpointsTable.jsx';

export default function MetricsPanel({ data, loading }) {
  const stats = data?.stats;
  const topEndpoints = data?.topEndpoints || [];

  const series = useMemo(
    () => bucketHitsByTime(data?.recentActivity),
    [data?.recentActivity],
  );

  // Compute error rate for display
  const errorRate = stats?.totalHits > 0
    ? ((stats.errorHits / stats.totalHits) * 100).toFixed(2)
    : '0.00';

  if (loading) {
    return <MetricsSkeleton />;
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto bg-background bg-grid-pattern min-h-full relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] pointer-events-none" />

      <MetricsHeader />
      
      <MetricsCards stats={stats} errorRate={errorRate} />

      <MetricsCharts series={series} />

      <TopEndpointsTable topEndpoints={topEndpoints} />
    </div>
  );
}
