import React, { useState, useEffect, useMemo } from 'react';
import { getDashboard } from '../../../api';
import { bucketHitsByTime, isLatencyAnomalous } from '../../../utils.js';
import { getSharedMockData } from "../../../mockData.js";

import AnalyticsSkeleton from './components/AnalyticsSkeleton.jsx';
import PanelHeader from './components/PanelHeader.jsx';
import KpiGrid from './components/KpiGrid.jsx';
import ThroughputChart from './components/ThroughputChart.jsx';
import LatencyChart from './components/LatencyChart.jsx';
import DistributionCards from './components/DistributionCards.jsx';
import DiagnosticsTable from './components/DiagnosticsTable.jsx';

export default function AnalyticsPanel({ profile, range }) {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isGuest = profile?.role === 'GUEST' || profile?.isDemo;

  const stats = dbData?.stats || null;

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        if (isGuest) {
          await new Promise(resolve => setTimeout(resolve, 600));
          if (active) {
            setDbData(getSharedMockData(range).dashboardData);
          }
        } else {
          const end = Date.now();
          let start = end - 24 * 60 * 60 * 1000;
          if (range === '7d') start = end - 7 * 24 * 60 * 60 * 1000;
          if (range === '1h') start = end - 60 * 60 * 1000;

          const query = { startTime: String(start), endTime: String(end) };
          const res = await getDashboard(query);
          
          const rawPayload = res.data || res;
          const payload = {
            ...rawPayload,
            recentActivity: rawPayload.recentActivity ?? rawPayload.recentActitivy ?? null,
          };

          if (active) {
            setDbData(payload);
          }
        }
      } catch (err) {
        console.error("Analytics fetch failed:", err);
        if (active) {
          setError(err.message || 'Failed to sync with infrastructure analytics.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchData();
    return () => { active = false; };
  }, [range, refreshTrigger, isGuest]);

  const series = useMemo(() => {
    const act = dbData?.recentActivity;
    return bucketHitsByTime(act || []);
  }, [dbData]);

  const displayErrorRate = stats?.errorRate != null ? Number(stats.errorRate).toFixed(2) : '0.00';

  const methodStats = useMemo(() => {
    const endpoints = dbData?.topEndpoints || [];
    const methodMap = {};
    const methodColors = {
      GET: '#10b981',
      POST: '#6366f1',
      PUT: '#f59e0b',
      DELETE: '#ef4444',
      PATCH: '#8b5cf6',
    };
    for (const ep of endpoints) {
      const method = ep.method || 'UNKNOWN';
      if (!methodMap[method]) {
        methodMap[method] = { name: method, value: 0, fill: methodColors[method] || '#64748b' };
      }
      methodMap[method].value += (ep.totalHits || 0);
    }
    const result = Object.values(methodMap).sort((a, b) => b.value - a.value);
    return result.length > 0 ? result : [
      { name: 'No Data', value: 1, fill: '#334155' }
    ];
  }, [dbData]);

  const responseStatusBreakdown = useMemo(() => {
    const total = stats?.totalHits || 0;
    const errors = stats?.errorHits || 0;
    const success = stats?.successHits || 0;

    if (total === 0) {
      return [{ name: 'No Data', value: 1, fill: '#334155' }];
    }

    return [
      { name: '2xx Success', value: success, fill: '#10b981' },
      { name: '4xx Client Err (est.)', value: Math.round(errors * 0.8), fill: '#f59e0b' },
      { name: '5xx Server Err (est.)', value: Math.round(errors * 0.2), fill: '#ef4444' },
    ];
  }, [stats]);

  const latencyGrade = useMemo(() => {
    const lat = Number(stats?.avgLatency) || 0;
    if (lat <= 0) return { label: 'Idle', color: 'text-muted-foreground', anomalous: false };
    if (isLatencyAnomalous(lat)) {
      return { label: 'Anomalous — check for outlier requests', color: 'text-red-400', anomalous: true };
    }
    if (lat < 100) return { label: 'Excellent (Optimal)', color: 'text-emerald-400', anomalous: false };
    if (lat < 1000) return { label: 'Good (Healthy)', color: 'text-indigo-400', anomalous: false };
    return { label: 'Fair (Acceptable)', color: 'text-amber-400', anomalous: false };
  }, [stats]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto bg-background bg-grid-pattern min-h-full relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] pointer-events-none" />

      <PanelHeader 
        isGuest={isGuest} 
        setRefreshTrigger={setRefreshTrigger} 
        error={error} 
      />

      <KpiGrid 
        stats={stats} 
        displayErrorRate={displayErrorRate} 
        latencyGrade={latencyGrade} 
      />

      <div className="relative bento-grid">
        <ThroughputChart series={series} />
        <LatencyChart series={series} />
      </div>

      <DistributionCards 
        methodStats={methodStats}
        responseStatusBreakdown={responseStatusBreakdown}
        dbData={dbData}
      />

      <DiagnosticsTable 
        dbData={dbData}
        range={range}
      />
    </div>
  );
}
