import { apiGet, apiPost } from './baseApi';

// Bootstrap: only valid before any super admin exists.
export function onboardSuperAdmin({ username, email, password }) {
  return apiPost('/api/auth/onboard-super-admin', { username, email, password });
}

export function register({ username, email, password, role }) {
  return apiPost('/api/auth/register', { username, email, password, role });
}

export function login({ username, password }) {
  return apiPost('/api/auth/login', { username, password });
}

export function getProfile() {
  return apiGet('/api/auth/profile');
}

export function logout() {
  return apiGet('/api/auth/logout');
}

export function createSystemAdmin({ username, email, password }) {
  return apiPost('/api/auth/create-system-admin', { username, email, password });
}
