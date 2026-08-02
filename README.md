# DevTrack — Full Architecture & DevOps README

## Project Overview

DevTrack is a full-stack expense tracker application. Ye project ek expense tracker hai jisme users apne income aur expenses record kar sakte hain. Iska main maksad personal finance ko track karna aur monthly spending categories ko visualize karna hai.

This repository contains:
- `backend/` — Node.js + Express API with JWT authentication and MongoDB persistence
- `frontend/` — React app built with Vite, Tailwind CSS, and Recharts
- `docker-compose.yml` — local multi-container orchestration for backend, frontend, MongoDB, and Mongo Express
- `k8s/` — Kubernetes manifests for deploying the app and database in a cluster

## What this project does

The app allows users to:
- register and login with JWT-based auth
- create, update, delete expense and income entries
- view monthly balance, income vs expense, and category breakdown
- store data securely in MongoDB

## Architecture Summary

### Application layers

1. Frontend:
   - React app served by Nginx in production
   - Uses Axios with base URL `/api`
   - Protects dashboard routes via `AuthContext`
   - Sends authenticated requests to backend via JWT bearer tokens

2. Backend:
   - Express API with `/api/auth` and `/api/expenses`
   - Connects to MongoDB using Mongoose
   - Uses `bcryptjs` for password hashing
   - Uses JWT for auth and request authorization

3. Database:
   - MongoDB stores users and expense documents
   - Backend uses a secure connection string and environment variables

### Deployment patterns

- Local development container orchestration via `docker-compose.yml`
- Production-like deployment via Kubernetes YAML manifests under `k8s/`
- Local Kubernetes cluster support with `k8s/kind-config.yaml`
- Networking and security policies for Kubernetes pods and services

## DevOps work included in this project

### Containerization

- `backend/Dockerfile`
  - Builds a production-ready Node.js image using `node:22-alpine`
  - Installs dependencies with `npm ci --omit=dev`
  - Creates a non-root user `nasir`
  - Adds a `HEALTHCHECK` for `/api/health`

- `frontend/Dockerfile`
  - Uses multi-stage build
  - First stage builds React app with Vite
  - Second stage serves static assets from `nginx:alpine`
  - Includes custom `frontend/nginx.conf` to proxy `/api` to backend
  - Adds a `HEALTHCHECK` for the frontend root path

### Service orchestration

- `docker-compose.yml`
  - Defines 4 services:
    - `mongodb` for the database
    - `mongo-express` for database UI
    - `backend` API service
    - `frontend` web server
  - Uses a custom network `devtrack-network`
  - Uses a Docker volume `mongo_data` to persist MongoDB data
  - Exposes ports:
    - `80` for frontend
    - `5000` for backend API
    - `27017` for MongoDB
    - `8081` for Mongo Express UI

### Kubernetes manifests

The K8s configuration covers:
- Namespace isolation: `k8s/namespace.yaml`
- Secrets: `k8s/secret.yaml` and `k8s/secret.example.yaml`
- ConfigMap: `k8s/configmap.yaml`
- Resource constraints: `k8s/limit-range.yaml`
- Priority class: `k8s/priority-class.yaml`
- Local kind cluster port mapping: `k8s/kind-config.yaml`
- Network policy: `k8s/networkpolicy/mongodb-networkpolicy.yaml`
- MongoDB persistent storage and deployment
- Backend deployment with probes, autoscaling, and pod disruption budget
- Frontend deployment and service
- Ingress rules for host-based routing

## Toolchain used in this project

### Backend tools
- Node.js 22
- Express.js for API routing
- Mongoose for MongoDB ORM
- bcryptjs for password hashing
- jsonwebtoken for JWT auth
- dotenv for environment variable loading
- cors for cross-origin support
- prom-client is included in `package.json` for Prometheus metrics support, though not currently wired into the code

### Frontend tools
- React 18
- Vite for development and production build
- React Router Dom for route management
- Axios for HTTP requests
- Tailwind CSS for styling
- Recharts for charts and category breakdown visuals

### Infrastructure tools
- Docker + Docker Compose for containerization and local service orchestration
- Nginx to serve frontend static files and proxy `/api` to backend
- Kubernetes manifests for production deployment patterns
- kind for local Kubernetes cluster configuration
- Mongo Express as a development database UI

## File and component overview

### Backend files
- `backend/package.json` — backend dependencies and scripts
- `backend/Dockerfile` — backend container build instructions
- `backend/src/server.js` — Express setup, routes mounting, health check endpoint, database connect
- `backend/src/config/db.js` — MongoDB connection logic
- `backend/src/routes/auth.js` — user registration, login, profile fetch/update
- `backend/src/routes/expenses.js` — CRUD operations for expense/income items and monthly summary
- `backend/src/models/User.js` — user schema, password hashing, comparePassword method
- `backend/src/models/Expense.js` — expense schema with type, category, user relation
- `backend/src/middleware/auth.js` — JWT authentication middleware

### Frontend files
- `frontend/package.json` — frontend dependencies and scripts
- `frontend/Dockerfile` — frontend production build and Nginx serve pipeline
- `frontend/nginx.conf` — nginx proxy configuration for `/api`
- `frontend/vite.config.js` — Vite config and dev server proxy
- `frontend/src/App.jsx` — route definitions and protected route wrapper
- `frontend/src/api/client.js` — Axios instance with token interceptor
- `frontend/src/context/AuthContext.jsx` — auth state, login/register, token persistence
- `frontend/src/pages/Dashboard.jsx` — main dashboard page with expense list, summary, and modal operations

## Kubernetes manifests explained

### Root manifest files
- `k8s/namespace.yaml`
  - Creates `devtrack` namespace for all resources

- `k8s/secret.yaml`
  - Stores sensitive values:
    - `JWT_SECRET`
    - `MONGO_USERNAME`
    - `MONGO_PASSWORD`
    - `MONGO_URI`

- `k8s/secret.example.yaml`
  - Template for secret values

- `k8s/configmap.yaml`
  - Defines non-sensitive configuration:
    - `PORT=5000`
    - `MONGO_HOST=mongodb`
    - `MONGO_PORT=27017`
    - `MONGO_DATABASE=devtrack`
    - `NODE_ENV=production`

- `k8s/limit-range.yaml`
  - Enforces container resource requests and limits across the namespace
  - Default requests: `100m` CPU, `128Mi` memory
  - Default limits: `250m` CPU, `256Mi` memory

- `k8s/priority-class.yaml`
  - Defines `backend-high-priority` for backend pods

- `k8s/kind-config.yaml`
  - Configures `kind` local cluster port forwarding for host ports `80` and `443`

### MongoDB manifests
- `k8s/mongodb/service.yaml`
  - ClusterIP service for MongoDB on port `27017`

- `k8s/mongodb/deployment.yaml`
  - Deploys MongoDB with 1 replica
  - Uses `devtrack-secret` for database root credentials
  - Uses PVC `mongodb-pvc` mounted at `/data/db`

- `k8s/mongodb/deployment-backup.yaml`
  - Duplicate of `deployment.yaml` available for backup/reference

- `k8s/mongodb/pvc.yaml`
  - PersistentVolumeClaim requesting `2Gi` storage

- `k8s/mongodb/headless-service.yaml`
  - Headless service with `clusterIP: None` for direct pod addressing

- `k8s/mongodb/serviceaccount.yaml`
  - ServiceAccount for MongoDB pod identity

### Backend manifests
- `k8s/backend/deployment.yaml`
  - Deploys backend with `replicas: 3`
  - Uses `RollingUpdate` strategy with `maxUnavailable: 0` and `maxSurge: 1`
  - Includes:
    - `startupProbe` on `/api/health`
    - `readinessProbe` on `/api/health`
    - `livenessProbe` on `/api/health`
  - Injects env vars from `devtrack-config` and `devtrack-secret`
  - Uses service account `backend-sa`
  - Uses `priorityClassName: backend-high-priority`
  - Includes node affinity and pod anti-affinity to prefer backend spread across hosts
  - Resource requests and limits are set for CPU and memory

- `k8s/backend/service.yml`
  - ClusterIP service exposing backend on port `5000`

- `k8s/backend/hpa.yaml`
  - HPA targeting backend deployment
  - Scales between 3 and 10 replicas based on average CPU utilization of `70%`

- `k8s/backend/pdb.yaml`
  - PodDisruptionBudget requiring at least `2` backend pods available

- `k8s/backend/serviceaccount.yaml`
  - ServiceAccount for backend pods

### Frontend manifests
- `k8s/frontend/deployment.yaml`
  - Deploys frontend with `replicas: 1`
  - Uses service account `frontend-sa`
  - Defines readiness and liveness probes for `/`
  - Sets resource requests and limits

- `k8s/frontend/service.yaml`
  - ClusterIP service exposing frontend on port `80`

- `k8s/frontend/serviceaccount.yaml`
  - ServiceAccount for frontend pods

### Ingress manifest
- `k8s/ingress/ingress.yaml`
  - Defines an Ingress with `ingressClassName: nginx`
  - Routes:
    - `devtrackp.local/` and `devtrack.local/` → frontend service
    - `devtrackp.local/api` and `devtrack.local/api` → backend service
  - Provides host-based routing for frontend and backend via a single gateway

### Network policy
- `k8s/networkpolicy/mongodb-networkpolicy.yaml`
  - Restricts MongoDB ingress to pods labeled `app: backend`
  - Ensures only backend pods can connect to MongoDB on port `27017`

## How the Kubernetes architecture works

1. `namespace.yaml` creates a dedicated namespace `devtrack`.
2. `secret.yaml` stores secrets used by backend and MongoDB.
3. `configmap.yaml` stores non-sensitive runtime values.
4. MongoDB is deployed with a PVC and secured by credentials.
5. Backend runs as a replicated deployment with probes, autoscaling, and resource limits.
6. Frontend runs behind Kubernetes service and S3-like static delivery via Nginx container image.
7. Ingress routes external traffic to frontend and backend services by host and path.
8. A network policy prevents any pod besides backend from reaching MongoDB.

## Running the project

### Docker Compose

```bash
docker compose up --build
```

Open:
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`
- Mongo Express: `http://localhost:8081`

### Kubernetes (local kind cluster)

1. Create namespace and resources:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/secret.yaml
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/limit-range.yaml
   kubectl apply -f k8s/priority-class.yaml
   kubectl apply -f k8s/networkpolicy/mongodb-networkpolicy.yaml
   kubectl apply -f k8s/mongodb/pvc.yaml
   kubectl apply -f k8s/mongodb/deployment.yaml
   kubectl apply -f k8s/mongodb/service.yaml
   kubectl apply -f k8s/backend/deployment.yaml
   kubectl apply -f k8s/backend/service.yml
   kubectl apply -f k8s/backend/hpa.yaml
   kubectl apply -f k8s/backend/pdb.yaml
   kubectl apply -f k8s/frontend/deployment.yaml
   kubectl apply -f k8s/frontend/service.yaml
   kubectl apply -f k8s/ingress/ingress.yaml
   ```

2. Access via hosts configured for `devtrackp.local` or `devtrack.local`.

## Notes and next improvements

- The backend includes `prom-client` dependency but metrics are not yet exposed in source code.
- The current ingress is configured for hostnames and assumes DNS / `/etc/hosts` entries.
- Production deployment should use a secure TLS ingress controller and secure secret management.
- CI/CD could be added for automated build, image push, and cluster deployment.

## Conclusion

This repository is not just a single app; it is a full DevOps-ready stack with:
- frontend + backend microservice separation
- containerized builds
- `docker-compose` orchestration
- Kubernetes manifests for cluster deployment
- persistent storage for MongoDB
- security and resource controls via secrets, network policy, probes, and limits

Use this README as the primary architectural guide to understand the services, tools, and deployment approach in the DevTrack project.