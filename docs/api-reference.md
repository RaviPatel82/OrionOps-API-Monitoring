# 🔌 API Reference & Authorization

## 🛡️ Authentication & Authorization

### 🔒 Client Ingestion Authentication

External client application hits are authenticated via API Keys.

1. The request supplies an `x-api-key` header.
2. The server verifies the key and client settings.
3. Checks if the client `isActive` and if the API key has the `canIngest` permission scope.
4. Attaches `req.client` and `req.apiKey` context to downstream requests.

### 🛡️ Role-Based Access Control (RBAC)

User access control is verified by extracting JWT cookie sessions and enforcing role scopes.

| Role              | Client Admin Scope | Clients List Scope | Onboard Clients |  Manage Keys   | View Analytics  |
| ----------------- | :----------------: | :----------------: | :-------------: | :------------: | :-------------: |
| **super_admin**   |         ✓          |         ✓          |        ✓        |       ✓        | ✓ (All tenants) |
| **client_admin**  |   ✓ (Own tenant)   |         —          |        —        | ✓ (Own tenant) | ✓ (Own tenant)  |
| **client_viewer** |   ✓ (Own tenant)   |         —          |        —        |       —        | ✓ (Own tenant)  |

---

## 🔌 API Endpoints

### 📡 1. Ingestion Endpoint

- **URL**: `POST /api/hit`
- **Auth**: `x-api-key` header (required)
- **Headers**:
    ```http
    x-api-key: obs_live_38d8fjs...
    Content-Type: application/json
    ```
- **Payload**:
    ```json
    {
        "eventId": "evt_98374987",
        "timestamp": "2026-06-06T14:40:00Z",
        "serviceName": "payment-service",
        "endpoint": "/v1/charges",
        "method": "POST",
        "statusCode": 201,
        "latencyMs": 145.5
    }
    ```
- **Response** (`202 Accepted`):
    ```json
    {
        "success": true,
        "message": "API hit queued for processing",
        "statusCode": 202,
        "data": {
            "eventId": "evt_98374987",
            "status": "queued"
        }
    }
    ```

### 👤 2. Authentication Router (`/api/auth`)

- `POST /onboard-super-admin`: Onboards the initial system administrator.
- `POST /register`: Registers tenant users.
- `POST /login`: Verifies user credentials and sets secure httpOnly cookies.
- `GET /profile`: Retrieves the active user session details.
- `GET /logout`: Destroys the cookie session.

### 🏢 3. Client & Tenant Management Router (`/api`)

- `GET /admin/clients`: Retrieves registered clients list.
- `POST /admin/clients/onboard`: Registers a new tenant and main user.
- `POST /admin/clients/:clientId/users`: Adds a client user.
- `GET /admin/clients/:clientId/users`: Get all client users.
- `PATCH /admin/clients/:clientId/users/:userId`: Deactivate client users.
- `POST /admin/clients/:clientId/api/keys`: Issues a new scoped API Key.
- `GET /admin/clients/:clientId/api/keys`: Lists active API Keys.
- `DELETE /admin/clients/:clientId/api-key/:keyId`: Remove API Key.

### 📊 4. Telemetry Analytics Router (`/api/analytics`)

- `GET /stats`: Aggregated summary statistics (hits, errors, latencies, counts).
- `GET /dashboard`: Full dashboard payload combining overall stats, top endpoints list, and recent activity metrics.
