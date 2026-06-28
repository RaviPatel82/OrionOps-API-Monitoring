export function generateMockHits(count = 500) {
  const endpoints = [
    { method: "GET", path: "/api/v1/users", service: "User_Service" },
    { method: "POST", path: "/api/v1/auth/login", service: "Auth_Service" },
    { method: "GET", path: "/api/v1/analytics/dashboard", service: "Telemetry_Node" },
    { method: "GET", path: "/api/v1/settings", service: "Config_Server" },
    { method: "POST", path: "/api/v1/users", service: "User_Service" },
    { method: "DELETE", path: "/api/v1/users/123", service: "User_Service" },
    { method: "PATCH", path: "/api/v1/settings/theme", service: "Config_Server" },
    { method: "GET", path: "/api/v1/clients", service: "Client_Gateway" },
    { method: "POST", path: "/api/v1/analytics/events", service: "Telemetry_Node" },
    { method: "GET", path: "/api/v1/health", service: "Gateway_Proxy" },
    { method: "PUT", path: "/api/v1/users/456/profile", service: "User_Service" },
    { method: "GET", path: "/api/v1/notifications", service: "Notification_Service" },
    { method: "POST", path: "/api/v1/webhooks", service: "Webhook_Engine" },
    { method: "GET", path: "/api/v1/logs", service: "Log_Aggregator" },
    { method: "DELETE", path: "/api/v1/sessions/expired", service: "Auth_Service" },
  ];
  const statuses = [200, 200, 200, 200, 200, 201, 204, 301, 400, 401, 403, 404, 429, 500, 502, 503];
  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0",
    "OrionOps-SDK/2.4.1 (Node.js 20.11)",
    "PostmanRuntime/7.36.3",
    "curl/8.4.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5) Safari/604.1",
    "OrionOps-CLI/1.0.0",
  ];
  const ips = ["192.168.1.42", "10.0.0.15", "172.16.0.88", "203.0.113.50", "198.51.100.23", "100.64.0.1", "172.31.255.12", "10.10.10.10"];
  const now = Date.now();
  const hits = [];

  for (let i = 0; i < count; i++) {
    const ep = endpoints[Math.floor(Math.random() * endpoints.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const latency = status >= 500
      ? Math.floor(Math.random() * 2000) + 500
      : Math.floor(Math.random() * 300) + 5;

    hits.push({
      id: `hit-${i + 1}`,
      timestamp: new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      method: ep.method,
      path: ep.path,
      service: ep.service,
      statusCode: status,
      latency,
      ip: ips[Math.floor(Math.random() * ips.length)],
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
    });
  }
  return hits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export const ALL_MOCK_HITS = generateMockHits(1000);
export const SHARED_MOCK_HITS = ALL_MOCK_HITS;

export function getSharedMockData(range) {
  const end = Date.now();
  let start = end - 24 * 60 * 60 * 1000;
  if (range === "7d") start = end - 7 * 24 * 60 * 60 * 1000;
  if (range === "1h") start = end - 60 * 60 * 1000;

  const filteredHits = ALL_MOCK_HITS.filter(h => {
    const t = new Date(h.timestamp).getTime();
    return t >= start && t <= end;
  });

  const totalHits = filteredHits.length;
  const errorHits = filteredHits.filter(h => h.statusCode >= 400).length;
  const successHits = filteredHits.filter(h => h.statusCode < 400).length;
  const errorRate = totalHits > 0 ? (errorHits / totalHits) * 100 : 0;
  const avgLatency = totalHits > 0 ? Math.round(filteredHits.reduce((acc, h) => acc + h.latency, 0) / totalHits) : 0;

  const uniqueServices = new Set(filteredHits.map(h => h.service)).size;
  const uniqueEndpoints = new Set(filteredHits.map(h => h.path)).size;

  const endpointMap = {};
  filteredHits.forEach(h => {
    if (!endpointMap[h.path]) {
      endpointMap[h.path] = {
        endpoint: h.path,
        method: h.method,
        serviceName: h.service,
        totalHits: 0,
        _latencySum: 0
      };
    }
    endpointMap[h.path].totalHits += 1;
    endpointMap[h.path]._latencySum += h.latency;
  });

  const topEndpoints = Object.values(endpointMap)
    .map(ep => ({
      ...ep,
      avgLatency: Math.round(ep._latencySum / ep.totalHits)
    }))
    .sort((a, b) => b.totalHits - a.totalHits)
    .slice(0, 4);

  const bucketSize = (end - start) / 24;
  const recentActivity = Array.from({ length: 24 }).map((_, i) => {
    const bucketStart = start + i * bucketSize;
    const bucketEnd = bucketStart + bucketSize;
    const bucketHits = filteredHits.filter(h => {
      const t = new Date(h.timestamp).getTime();
      return t >= bucketStart && t < bucketEnd;
    });

    const bTotal = bucketHits.length;
    const bError = bucketHits.filter(h => h.statusCode >= 400).length;
    const bLatency = bTotal > 0 ? Math.round(bucketHits.reduce((acc, h) => acc + h.latency, 0) / bTotal) : 0;

    return {
      timestamp: new Date(bucketStart).toISOString(),
      totalHits: bTotal,
      errorHits: bError,
      avgLatency: bLatency,
    };
  });

  const dashboardData = {
    stats: {
      totalHits,
      errorHits,
      successHits,
      errorRate,
      avgLatency,
      uniqueServices,
      uniqueEndpoints,
      timeRange: {
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      },
    },
    topEndpoints,
    recentActivity,
  };

  return { dashboardData, hits: filteredHits };
}

export const SHARED_MOCK_DASHBOARD_DATA = getSharedMockData("24h").dashboardData;

// Mock Team Members
export const SHARED_MOCK_USERS = [
  { _id: "u1", username: "admin_ravi", email: "ravi@orionops.app", role: "client_admin" },
  { _id: "u2", username: "dev_sarah", email: "sarah@orionops.app", role: "client_viewer" },
  { _id: "u3", username: "ops_mike", email: "mike@orionops.app", role: "client_viewer" },
  { _id: "u4", username: "data_alex", email: "alex@orionops.app", role: "client_viewer" },
];

// Mock API Keys
export const SHARED_MOCK_API_KEYS = [
  { _id: "k1", name: "Production Gateway", prefix: "apim_prod", environment: "production", description: "Main production API gateway key", createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "k2", name: "Staging Testing", prefix: "apim_stg", environment: "staging", description: "Used for staging environments", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "k3", name: "Local Dev Sarah", prefix: "apim_dev", environment: "development", description: "Sarah's local development key", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];
