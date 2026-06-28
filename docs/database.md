# 💾 Database Design

## 🍃 MongoDB Models (NoSQL - Flexible Metadata & Raw Event Logs)

MongoDB stores client configuration metadata, API credentials, and long-tail raw audit logs.

### 🏢 1. Client Schema

Represents a multi-tenant client organization. 

- `name` (String, Required): Company or organization name.
- `slug` (String, Unique, Required): Url-safe unique slug.
- `email` (String, Required): Primary contact email.
- `createdBy` (ObjectId, Ref: User): User who registered the client.
- `isActive` (Boolean, Default: true): Client tenant status.
- `settings` (Object): Custom parameters.
    - `dataRetentionDays` (Number, Default: 30)
    - `alertsEnabled` (Boolean, Default: true)
    - `timezone` (String, Default: 'UTC')

### 👥 2. User Schema

Enforces credentials and permissions. 

- `username` (String, Unique, Required)
- `email` (String, Unique, Required)
- `password` (String, Hashed, Required)
- `role` (String, Enum: `super_admin`, `client_admin`, `client_viewer`)
- `clientId` (ObjectId, Ref: Client, Conditional Require): Required for all client-scoped users.
- `isActive` (Boolean, Default: true)
- `permissions` (Object):
    - `canCreateApiKeys` (Boolean, Default: false)
    - `canManageUsers` (Boolean, Default: false)
    - `canViewAnalytics` (Boolean, Default: true)
    - `canExportData` (Boolean, Default: false)

### 🔑 3. API Key Schema

Defines credentials used to validate client agents. 

- `keyId` (String, Unique, Index): Identifies the key.
- `keyValue` (String, Unique, Index): Hashed or unique key secret.
- `clientId` (ObjectId, Ref: Client): Associated tenant.
- `name` (String, Required): Human name identifier.
- `environment` (String, Enum: `production`, `staging`, `development`, `testing`)
- `isActive` (Boolean, Default: true)
- `permissions` (Object):
    - `canIngest` (Boolean, Default: true)
    - `canReadAnalytics` (Boolean, Default: false)
    - `allowedServices` (Array of Strings)
- `security` (Object):
    - `allowedIPs` (Array of IP Subnets / Wildcards)
    - `allowedOrigins` (Array of Domains / Wildcards)
- `expiresAt` (Date): Auto-expiring TTL index context.

### 📈 4. Raw API Hits Schema

Logs individual API requests.

- `eventId` (String, Unique): ID assigned to query.
- `timestamp` (Date, Required): Time of API execution.
- `serviceName` (String, Required)
- `endpoint` (String, Required)
- `method` (String, Enum: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.)
- `statusCode` (Number, Required)
- `latencyMs` (Number, Required)
- `clientId` (ObjectId, Ref: Client)
- `apiKeyId` (ObjectId, Ref: ApiKey)
- `ip` (String)
- `userAgent` (String)

---

## 🐘 PostgreSQL Schema (Relational - Fast Metric Aggregations)

PostgreSQL handles optimized time-bucket metrics to power charts and aggregates.

### Table: `endpoint_metrics`

| Column         | Type            | Constraints                 | Description                         |
| -------------- | --------------- | --------------------------- | ----------------------------------- |
| `id`           | `SERIAL`        | `PRIMARY KEY`               | Autoincrement PK                    |
| `client_id`    | `VARCHAR(24)`   | `NOT NULL`                  | References MongoDB Client id string |
| `service_name` | `VARCHAR(255)`  | `NOT NULL`                  | Client Microservice name            |
| `endpoint`     | `VARCHAR(500)`  | `NOT NULL`                  | Executed URL path                   |
| `method`       | `VARCHAR(10)`   | `NOT NULL`                  | HTTP verb                           |
| `time_bucket`  | `TIMESTAMP`     | `NOT NULL`                  | Hourly aggregated timestamp bucket  |
| `total_hits`   | `INTEGER`       | `DEFAULT 0`                 | Total calls in this hour bucket     |
| `error_hits`   | `INTEGER`       | `DEFAULT 0`                 | Total error calls (status >= 400)   |
| `avg_latency`  | `NUMERIC(10,3)` | `DEFAULT 0.000`             | Running average latency (ms)        |
| `min_latency`  | `NUMERIC(10,3)` | `DEFAULT 0.000`             | Minimum latency recorded (ms)       |
| `max_latency`  | `NUMERIC(10,3)` | `DEFAULT 0.000`             | Maximum latency recorded (ms)       |
| `created_at`   | `TIMESTAMP`     | `DEFAULT CURRENT_TIMESTAMP` | Table creation                      |
| `updated_at`   | `TIMESTAMP`     | `DEFAULT CURRENT_TIMESTAMP` | Table update                        |

- **Unique Constraint**: `UNIQUE(client_id, service_name, endpoint, method, time_bucket)` ensures that the processor can perform safe UPSERT statements.
- **Optimization Indexes**:
    - `idx_endpoint_metrics_client_id` on `client_id`
    - `idx_endpoint_metrics_service` on `(client_id, service_name)`
    - `idx_endpoint_metrics_time` on `time_bucket`
    - `idx_endpoint_metrics_endpoint` on `(client_id, service_name, endpoint)`
