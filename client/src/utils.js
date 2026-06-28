export function formatNumber(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

export function formatPercent(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return `${Number(n).toFixed(1)}%`;
}

export function formatLatency(ms) {
  const val = Number(ms);
  if (ms == null || Number.isNaN(val)) return '—';
  if (val < 1) return `${val.toFixed(2)} ms`;
  if (val < 1000) return `${Math.round(val)} ms`;
  if (val < 60000) return `${(val / 1000).toFixed(2)} s`;
  return `${(val / 60000).toFixed(1)} min`;
}

export function isLatencyAnomalous(ms) {
  const val = Number(ms);
  return !Number.isNaN(val) && val >= 5000;
}

/** Roll up time-series points by bucket for throughput bars */
export function bucketHitsByTime(points) {
  if (!Array.isArray(points) || points.length === 0) return [];

  const map = new Map();

  for (const p of points) {
    const raw = p.timeBucket ?? p.timestamp;
    if (!raw) continue;

    const date = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(date.getTime())) continue;

    const bucketKey = date.toISOString();

    if (!map.has(bucketKey)) {
      map.set(bucketKey, {
        sortKey: bucketKey,
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hits: 0,
        errors: 0,
        _latencySum: 0,
        _latencyCount: 0,
      });
    }

    const bucket = map.get(bucketKey);
    bucket.hits += Number(p.totalHits) || 0;
    bucket.errors += Number(p.errorHits) || 0;

    if (p.avgLatency != null && !Number.isNaN(Number(p.avgLatency))) {
      bucket._latencySum += Number(p.avgLatency);
      bucket._latencyCount += 1;
    }
  }

  return Array.from(map.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ sortKey, _latencySum, _latencyCount, ...rest }) => ({
      ...rest,
      avgLatency: _latencyCount > 0 ? Math.round(_latencySum / _latencyCount) : 0,
    }));
}