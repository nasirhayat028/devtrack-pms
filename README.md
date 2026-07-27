# DevTrack — Private Ledger

A full-stack expense tracker with a luxury, private-banking-style UI.

**Stack:** React (Vite) + Tailwind + Recharts · Node.js/Express · MongoDB · JWT auth

```
devtrack/
├── backend/     Express API (auth + expenses)
└── frontend/    React app (Vite + Tailwind + Recharts)
```

## 1. Prerequisites

- Node.js 18+
- MongoDB running locally (or a connection string to any MongoDB instance)

Install MongoDB locally (if not already):
```bash
# macOS
brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community

# Ubuntu/Debian
sudo apt install -y mongodb
sudo systemctl start mongodb
```

Or skip installing anything and just run:
```bash
docker run -d -p 27017:27017 --name devtrack-mongo mongo:7
```

## 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API will run at `http://localhost:5000`. Health check: `GET /api/health`.

Edit `.env` if your Mongo URI or port differs:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/devtrack
JWT_SECRET=change_this_to_a_long_random_secret
```

## 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite is configured to proxy `/api` requests to the backend on port 5000, so no extra config is needed.

## 4. Using the app

1. Go to `/register`, create an account (name, email, password, optional monthly budget).
2. You'll land on the Dashboard — add income/expense entries with the **+ New entry** button.
3. The balance card, category donut chart, and ledger update live from MongoDB.

## API Reference (quick)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user (auth required) |
| PUT | `/api/auth/me` | Update profile/budget |
| GET | `/api/expenses?month=YYYY-MM` | List transactions |
| POST | `/api/expenses` | Create transaction |
| PUT | `/api/expenses/:id` | Update transaction |
| DELETE | `/api/expenses/:id` | Delete transaction |
| GET | `/api/expenses/summary/:month` | Totals + category breakdown |

## Next steps (DevOps phases)

This app is intentionally split into two independent services (frontend/backend) plus a database dependency — ready for:
- Dockerfiles for both services + `docker-compose.yml`
- CI pipeline (lint/test/build → image push)
- Kubernetes manifests (Deployments + Services for frontend, backend, MongoDB)
- Monitoring/logging stack on top

We'll build these in the next phase.
