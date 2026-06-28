# 🚀 OrionOps: Real-Time API Hit Tracking & Monitoring System Workflow Documentation

<div align="center">

<br/>

[![Node.js](https://img.shields.io/badge/Node.js_18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js_4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React_18-20232F?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://rabbitmq.com)

**OrionOps** is a high-throughput, multi-tenant API telemetry and monitoring solution.  
**Track hits. Aggregate metrics. Analyze latency. Secure endpoints.**

[🚀 Getting Started](#⚙️-quick-start--setup) &nbsp;&middot;&nbsp; [🏗️ System Architecture](#🏗️-system-architecture) &nbsp;&middot;&nbsp; [🌊 Core Pipelines](#🌊-event-driven-ingest-pipeline) &nbsp;&middot;&nbsp; [🔌 API Reference](#🔌-api-endpoints)

</div>

---

## 📋 Table of Contents

1. [🚀 Overview](#🚀-overview)
2. [🛠️ Tech Stack](#🛠️-tech-stack)
3. [📁 Folder Structure](#📁-folder-structure)
4. [📚 Documentation](#📚-documentation)
5. [⚙️ Quick Start & Setup](#⚙️-quick-start--setup)
6. [📝 Environment Configurations](#📝-environment-configurations)

---

## 🚀 Overview

**OrionOps** is designed to capture, process, and visualize API metrics at scale. Instead of forcing application servers to block or run slow queries while logging requests, OrionOps provides a high-throughput `/api/hit` ingestion endpoint that offloads analytics asynchronously using **RabbitMQ** and segregates raw transactional logs (**MongoDB**) from aggregated metrics (**PostgreSQL**).

### ✨ Key Features

- **⚡ Asynchronous Telemetry Ingestion**: Decouples API hit logging from analytics using RabbitMQ queues with publisher confirms.
- **🛡️ Resilient Fallback Design**: Ensures that if database updates fail, raw records are protected, and client applications receive non-blocking immediate feedback.
- **⏱️ Circuit Breaking & Retries**: Employs exponential backoff, jitter, and circuit breaker patterns to survive high load and transient queue downtime.
- **🔑 Granular API Key Management**: Multi-tenant key scopes including environments, allowed IP/origins, service limits, and permissions.
- **📊 Interactive Dashboards**: Real-time traffic, latency, and status charts using React, TailwindCSS, and Recharts.

---

## 🛠️ Tech Stack

OrionOps leverages a robust modern polyglot tech stack to handle high-throughput telemetry writes and analytical aggregations:

| Technology               | Category                | Version           | Purpose / Description                                                        |
| :----------------------- | :---------------------- | :---------------- | :--------------------------------------------------------------------------- |
| **Node.js**              | Runtime                 | `^18.x`           | JavaScript server runtime environment                                        |
| **Express.js**           | Backend Framework       | `^4.18.2`         | Fast, minimalist web framework for ingestion & admin REST APIs               |
| **React**                | Frontend Library        | `^18.2.0`         | Library for building the single-page admin console UI                        |
| **Vite**                 | Build Tool / Dev Server | `^5.0.0`          | Next-generation frontend tooling and fast hot module replacement             |
| **RabbitMQ**             | Message Broker          | `^3.10.x`         | High-performance message queue for asynchronous event ingestion              |
| **MongoDB & Mongoose**   | NoSQL Database & ODM    | `^6.0` / `^8.0.0` | Stores raw telemetry events, tenant metadata, users, and API key policies    |
| **PostgreSQL**           | Relational Database     | `^15.x`           | Relational store for aggregated metrics and fast dashboard query reads       |
| **Recharts**             | Data Visualization      | `^3.8.1`          | Interactive charting library for real-time latencies, hits, and status codes |
| **Zod**                  | Schema Validation       | `^4.4.3`          | Type-safe schema validation for ingestion payloads and database models       |
| **Docker & Compose**     | Containerization        | -                 | Multi-container environment orchestration for databases and microservices    |
| **TailwindCSS**          | CSS Framework           | `^4.3.0`          | Utility-first CSS framework for modern styling                               |

---

## 📁 Folder Structure

Below is the directory structure of the OrionOps repository:

```text
orionops/
├── client/                  # Frontend application (Vite + React)
│   ├── src/
│   │   ├── api/             # API client configurations and endpoints
│   │   ├── assets/          # Static assets (images, icons)
│   │   ├── components/      # UI components & route views
│   │   ├── lib/             # Utility libraries
│   │   ├── App.jsx          # Main application entry and router
│   │   ├── DashboardPage.jsx# Dashboard views and visualizations
│   │   └── main.jsx         # App mounting point
│   ├── package.json         # Frontend dependencies and scripts
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── vite.config.js       # Vite build configuration
├── docs/                    # Technical documentation
│   ├── api-reference.md     # API Endpoints & Auth docs
│   ├── architecture.md      # System design and event pipelines
│   ├── database.md          # PostgreSQL & MongoDB schemas
│   └── frontend.md          # Frontend architecture details
└── server/                  # Backend application (Express.js)
    ├── scripts/             # Database initialization and setup scripts
    ├── src/
    │   ├── services/        # Domain-driven backend modules
    │   │   ├── analytics/   # Analytics query handlers & routes
    │   │   ├── auth/        # Authentication, JWT logic & routes
    │   │   ├── client/      # Client and Tenant management
    │   │   ├── ingest/      # API hit ingestion gateway & routes
    │   │   └── processor/   # Background RabbitMQ consumer & PostgreSQL upserts
    │   ├── shared/          # Shared configuration and utilities
    │   │   ├── config/      # Shared environment configuration loaders
    │   │   ├── constants/   # Global constants
    │   │   ├── events/      # Circuit breaker and RabbitMQ event producer
    │   │   ├── middlewares/ # Express authentication & verification middlewares
    │   │   ├── models/      # Mongoose schemas for MongoDB
    │   │   └── utils/       # Shared utility functions
    │   ├── crypto-polyfill.js # Crypto library polyfill
    │   └── server.js        # Main Express server entry point
    ├── docker-compose.yml   # Multi-container local deployment spec
    ├── Dockerfile           # Docker configuration for Ingestion Server
    ├── Dockerfile.consumer  # Docker configuration for Background Consumer
    └── package.json         # Backend dependencies and scripts
```

---

## 📚 Documentation

Detailed documentation has been separated into the following guides:

- [🏗️ Architecture & Pipelines](./docs/architecture.md)
- [💾 Database Design](./docs/database.md)
- [🔌 API Reference & Auth](./docs/api-reference.md)
- [💻 Frontend Application](./docs/frontend.md)

---

## ⚙️ Quick Start & Setup

### 📋 Requirements

Ensure you have the following installed on your machine:

```text
Node.js     ≥ 18
MongoDB     ≥ 6.0
PostgreSQL  ≥ 15
RabbitMQ    ≥ 3.10
```

### 💻 Local Dev Setup

1. **Clone and Install Server Dependencies**:

    ```bash
    cd server
    npm install
    ```

2. **Configure Database Schema**:
   Run the init script against your local PostgreSQL instance:

    ```bash
    psql -h localhost -U postgres -d api_monitoring -f scripts/init-postgres.sql
    ```

3. **Initialize Environment Variables**:
   Setup the `.env` file in the server directory based on the configuration guide below.

4. **Start Backend**:
    - Start the main Express server:
        ```bash
        npm run dev
        ```
    - Start the background queue consumer:
        ```bash
        npm run processor
        ```

5. **Start Frontend Application**:
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    Open and access the portal at `http://localhost:5173`.

---

### 🐳 Docker Compose Setup (Recommended)

OrionOps provides a complete containerized stack configured in [docker-compose.yml](server/docker-compose.yml) to deploy databases, message brokers, administration dashboard, ingestion servers, and consumers in one command.

#### Services Orchestrated:

- **`postgres`**: PostgreSQL database container (`postgres:15-alpine`) with SQL volume persistence and auto-initialized schema from [init-postgres.sql](server/scripts/init-postgres.sql). Runs internally on port `5432` (mapped to host `5433`).
- **`mongo`**: MongoDB document database (`mongo:6.0`) for raw event logging and client metadata persistence.
- **`rabbitmq`**: RabbitMQ message broker (`rabbitmq:3-management-alpine`) with the management dashboard enabled.
- **`pgadmin`**: pgAdmin portal (`dpage/pgadmin4:7`) for PostgreSQL monitoring (runs on host port `8080`).
- **`api-app`**: Ingestion server built from [Dockerfile](server/Dockerfile) (runs internally on port `5000` and maps to port `5001`).
- **`consumer`**: Event consumer built from [Dockerfile.consumer](server/Dockerfile.consumer) to process RabbitMQ event backlogs.

#### Commands:

- **Build and start the entire stack in the background**:
    ```bash
    cd server
    docker-compose up --build -d
    ```
- **Check container statuses and health check responses**:
    ```bash
    docker-compose ps
    ```
- **View streaming logs for the processor or server**:
    ```bash
    docker-compose logs -f consumer
    docker-compose logs -f api-app
    ```
- **Stop and terminate containers, networks, and resources**:
    ```bash
    docker-compose down
    ```

---

## 📝 Environment Configurations

### Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development

# Database connections
MONGO_URI=mongodb://localhost:27017/api_monitoring
MONGO_DB_NAME=api_monitoring

PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=api_monitoring
PG_USER=postgres
PG_PASSWORD=postgres

# Message Broker queue settings
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=api_hits
RABBITMQ_RETRY_ATTEMPTS=5
RABBITMQ_RETRY_DELAY=1000

# Auth credentials
JWT_SECRET=super_secret_high_entropy_key_orionops_production
JWT_EXPIRES_IN=24h

# Global Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Client (`client/.env.development`)

```env
# Browser calls Vite; /api is proxied to the backend. Match this port to server PORT in server/.env
VITE_API_PROXY_PORT=5000
VITE_API_PROXY_HOST=127.0.0.1
```
