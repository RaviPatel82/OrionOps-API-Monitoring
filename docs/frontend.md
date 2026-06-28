# 💻 Frontend Application

The frontend is a multi-route React application hosted via Vite, styled with TailwindCSS, and uses Recharts for interactive visualizations.

## 🗺️ Main Layout Routing Hierarchy

The application routing is defined in `client/src/App.jsx` using React Router.

- **Public Routes**:
    - `/` -> `LandingPage`: Product overview, login access, and live demo entry point.
    - `/auth` -> `AuthPage`: Secure authentication portal for login and registration.
    - `/setup-admin` -> `SetupAdminPage`: Guided setup for the initial system Super Admin.
    - `/docs` -> `DocsPage`: API Integration documentation and quickstart guides.

- **Protected Routes**:
    - `/dashboard` -> `DashboardPage`: The main administrative and analytics portal.

## 📊 Dashboard Views (Panels)

Inside the `DashboardPage`, a sidebar is used to navigate between different state-based views (panels) rather than separate routes. This ensures seamless and instant context switching:

- **Metrics** (`MetricsPanel`): The default overview dashboard with high-level stats, active traffic, and recent activity.
- **Analytics** (`AnalyticsPanel`): In-depth path-by-path latency breakdown and aggregated charts over customizable time ranges (1h, 24h, 7d).
- **API Hits** (`ApiHitsPanel`): A detailed, filterable data table showing the raw API request logs.
- **API Keys** (`ApiPanel`): Key rotation, creation, and scoping controls for API authentication.
- **Team** (`TeamPanel`): User management and access control for the tenant.

## 📁 Component Structure

The `client/src/components/` directory is organized by feature:
- `Auth/` - Login, registration, and setup flows.
- `Dashboard/` - The sidebar, header, and all the individual panels mentioned above.
- `Landing/` - The marketing and product overview page.
- `Docs/` - Documentation viewer.
- `ui/` - Reusable, atomic UI components (e.g., buttons, inputs, dialogs).
- `Common/` - Shared layouts and wrappers.

## 📈 Visualization Dashboards

Recharts is initialized dynamically inside the dashboard panels (primarily in `MetricsPanel` and `AnalyticsPanel`):

- **Metrics Over Time**: Area and line charts for hits and latencies across different time buckets.
- **Status Distribution**: Pie/Donut charts for breakdown of response statuses (2xx, 3xx, 4xx, 5xx).
