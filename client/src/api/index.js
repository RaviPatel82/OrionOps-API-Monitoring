/**
 * Barrel file — re-exports every API helper so the rest of the app
 * can import from `@/api` (or `../../api`) without knowing the internal split.
 */

// ── low-level primitives ──
export { apiFetch, apiGet, apiPost, BASE_URL } from './baseApi';

// ── domain modules ──
export * from './auth';
export * from './analytics';
export * from './client';

// ── backward-compatible alias ──
// Many existing components still call `apiRequest(path, opts)`.
// It is functionally identical to `apiFetch`.
import { apiFetch } from './baseApi';
export const apiRequest = apiFetch;

// ── authorization helpers ──
const DASHBOARD_ROLES = new Set([
  'super_admin',
  'system_admin',
  'client_admin',
  'client_viewer',
  'GUEST',
]);

export function canViewDashboard(profile) {
  if (!profile) return false;
  return DASHBOARD_ROLES.has(profile.role);
}
