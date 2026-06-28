import { apiGet, apiPost, apiDelete, apiPatch } from './baseApi';

// Create a new client organization. Returns clientId used by downstream calls.
export function onboardClient({ name, email, discription, website }) {
  return apiPost('/api/admin/clients/onboard', { name, email, discription, website });
}

// POST /api/admin/clients/:clientId/user  (singular "/user", not "/users")
export function createClientUser(clientId, { username, email, password, role }) {
  return apiPost(`/api/admin/clients/${clientId}/user`, { username, email, password, role });
}

// POST /api/admin/clients/:clientId/api-key — generate a new API key
// Backend fields: name (required), description (optional), environment (optional)
export function createClientApiKey(clientId, { name, description, environment }) {
  return apiPost(`/api/admin/clients/${clientId}/api-key`, { name, description, environment });
}

// DELETE /api/admin/clients/:clientId/api-key/:keyId — delete an API key
export function deleteClientApikey(clientId, apiKeyId) {
  return apiDelete(`/api/admin/clients/${clientId}/api-key/${apiKeyId}`);
}

// PATCH /api/admin/clients/:clientId/users/:userId — remove/deactivate a user
export function deleteClientUser(clientId, userId) {
  return apiPatch(`/api/admin/clients/${clientId}/users/${userId}`);
}

// GET /api/admin/clients/:clientId/api-key — list all API keys for a client
export function listClientApiKeys(clientId) {
  return apiGet(`/api/admin/clients/${clientId}/api-key`);
}

// GET /api/admin/clients — list all client organizations (super admin)
export function listClients() {
  return apiGet('/api/admin/clients');
}

// GET /api/admin/clients/:clientId/users — list users for a client
export function listClientUsers(clientId) {
  return apiGet(`/api/admin/clients/${clientId}/users`);
}
