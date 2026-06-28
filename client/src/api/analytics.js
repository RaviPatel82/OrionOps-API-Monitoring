import { apiGet } from './baseApi';

export function getStats({ startTime, endTime } = {}) {
  const params = new URLSearchParams();
  if (startTime) params.set('startTime', startTime);
  if (endTime) params.set('endTime', endTime);
  const qs = params.toString();
  return apiGet(`/api/analytics/stats${qs ? `?${qs}` : ''}`);
}

export function getDashboard({ startTime, endTime } = {}) {
  const params = new URLSearchParams();
  if (startTime) params.set('startTime', startTime);
  if (endTime) params.set('endTime', endTime);
  const qs = params.toString();
  return apiGet(`/api/analytics/dashboard${qs ? `?${qs}` : ''}`);
}

export function getHits({ filters } = {}) {
  const params = new URLSearchParams();
  if (filters?.startTime) params.set('startTime', filters.startTime);
  if (filters?.endTime) params.set('endTime', filters.endTime);
  if (filters?.statusClass) params.set('statusClass', filters.statusClass);
  if (filters?.endpoint) params.set('endpoint', filters.endpoint);
  if (filters?.serviceName) params.set('serviceName', filters.serviceName);
  if (filters?.method) params.set('method', filters.method);
  if (filters?.limit) params.set('limit', filters.limit);
  if (filters?.offset) params.set('offset', filters.offset);
  if (filters?.sortBy) params.set('sortBy', filters.sortBy);
  if (filters?.sortDir) params.set('sortDir', filters.sortDir);
  const qs = params.toString();
  return apiGet(`/api/analytics/hits${qs ? `?${qs}` : ''}`);
}