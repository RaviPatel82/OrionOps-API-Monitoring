const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Core request wrapper.
 * - Always sends credentials so the httpOnly auth cookie is included.
 * - Throws an Error with a readable message on non-2xx responses.
 * - Returns parsed JSON on success (or null for empty bodies, e.g. 204/logout).
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = body?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
}

export function apiGet(path) {
  return apiFetch(path, { method: 'GET' });
}

export function apiPost(path, data, extraHeaders = {}) {
  return apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: extraHeaders,
  });
}

export function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}

export function apiPatch(path, data, extraHeaders = {}) {
  return apiFetch(path, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
    headers: extraHeaders,
  });
}

export { BASE_URL };
