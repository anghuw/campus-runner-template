# 🏃 Campus Runner

[![CI](https://github.com/anghuw/campus-runner-template/actions/workflows/ci.yml/badge.svg)](https://github.com/anghuw/campus-runner-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/github/v/release/anghuw/campus-runner-template)](https://github.com/anghuw/campus-runner-template/releases)

A full-stack campus errands app starter — Expo React Native frontend + Express/Prisma backend.

> **v0.3.0** — Frontend can switch between mock mode and backend API mode. Backend has auth, task CRUD, and integration tests.

## Why This Project Exists

Building a campus errands or delivery app from scratch requires setting up authentication, database, API, navigation, state management, and UI — all at once. This project saves that setup time.

It's designed for:
- **Students** learning full-stack mobile development with a real, runnable project
- **Developers** who want a starter template for campus service apps (errands, delivery,互助)
- **Hackathon teams** who need a working full-stack prototype fast

The codebase demonstrates modern patterns: Expo + React Native, Express + Prisma + SQLite, JWT auth, Zustand state management, and TypeScript throughout — with both mock data and real API modes.

## What's Included

### Frontend (Expo React Native)
- 10 screen pages (mock data by default, API mode optional)
- Login and registration page
- Bottom tab + stack navigation
- Zustand state management
- API client with automatic mock/API mode switch
- TypeScript strict mode

### Backend (Express + Prisma)
- Express + TypeScript server
- Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- JWT authentication (register/login/me)
- Task CRUD with lifecycle (pending → accepted → picking → delivering → completed)
- Zod input validation
- Seed script with demo data
- Integration tests (21 assertions)

## Quick Start

### Option A: Mock Mode (no backend needed)

```bash
# Frontend only — uses built-in mock data
npm install
npm start
```

### Option B: Full-Stack Mode

**Terminal 1 — Backend:**
```bash
cd server
npm install
cp .env.example .env
npm run db:push
npm run seed      # creates demo users and tasks
npm run dev       # starts at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
# In project root
echo "EXPO_PUBLIC_API_BASE_URL=http://localhost:3001" > .env
npm install
npm start
```

## Environment Variables

### Frontend (`.env`)

```env
# Empty = mock mode (default)
# Set URL = API mode
EXPO_PUBLIC_API_BASE_URL=
```

### Backend (`server/.env`)

```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-in-production"
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register (phone + password) |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/tasks` | No | List tasks (filter: status, type, keyword) |
| GET | `/api/tasks/:id` | No | Task detail |
| POST | `/api/tasks` | Yes | Create task |
| POST | `/api/tasks/:id/accept` | Yes | Accept task |
| POST | `/api/tasks/:id/start` | Yes | Start picking |
| POST | `/api/tasks/:id/complete` | Yes | Mark complete |
| POST | `/api/tasks/:id/confirm` | Yes | Confirm completion |
| POST | `/api/tasks/:id/cancel` | Yes | Cancel task |

### Demo Accounts (after `npm run seed`)

| Phone | Password | Name |
|-------|----------|------|
| 13800000001 | 123456 | 小明 |
| 13800000002 | 123456 | 小红 |

## Current Status

### ✅ Done
- Frontend template with 10 screens and mock data
- Login/registration page
- Backend API with auth and task CRUD
- Frontend API client with mock/API mode switch
- HomePage fetches tasks from API in API mode
- PublishPage creates tasks via API in API mode
- Integration tests (21 assertions, all pass)
- CI: frontend type-check + backend type-check + backend tests

### ❌ Not Yet Done
- OrderDetailPage still uses mock data only
- OrdersPage still uses mock data only
- ProfilePage still uses mock data only
- MessagesPage and ChatPage are UI only
- No real-time chat
- No push notifications
- No map integration
- No E2E tests
- Not production-ready

## Running Tests

```bash
# Start server first
cd server
npm run dev

# In another terminal
cd server
npm test
```

## Project Structure

```
campus-runner/
├── App.tsx                        # Frontend entry
├── src/
│   ├── api/                       # API client (mock/API switch)
│   │   ├── client.ts              # HTTP client
│   │   ├── tasks.ts               # Task API
│   │   ├── auth.ts                # Auth API
│   │   └── index.ts
│   ├── pages/
│   │   ├── HomePage.tsx           # ✅ Connected to API
│   │   ├── PublishPage.tsx        # ✅ Connected to API
│   │   ├── LoginPage.tsx          # ✅ Auth (mock + API)
│   │   ├── OrdersPage.tsx         # Mock only
│   │   ├── OrderDetailPage.tsx    # Mock only
│   │   ├── ProfilePage.tsx        # Mock only
│   │   └── ... (6 more pages)
│   ├── stores/useStore.ts         # Zustand with API actions
│   ├── data/mockData.ts           # Mock data
│   └── ...
├── server/
│   ├── prisma/schema.prisma       # User, Task, Category
│   ├── src/
│   │   ├── index.ts               # Express server
│   │   ├── routes/auth.ts         # Auth endpoints
│   │   ├── routes/tasks.ts        # Task endpoints
│   │   ├── middleware/auth.ts     # JWT middleware
│   │   └── __tests__/
│   │       └── integration.test.ts # 21 assertions
│   ├── seed.ts                    # Demo data
│   └── .env.example
├── docs/ROADMAP.md
├── .github/workflows/ci.yml
└── ...
```

## Tech Stack

| Layer | Frontend | Backend |
|-------|----------|---------|
| Framework | Expo SDK 56 + React Native 0.85 | Express 4 |
| Language | TypeScript 6 | TypeScript 5 |
| Navigation | React Navigation 7 | — |
| State | Zustand 5 | — |
| Database | — | Prisma + SQLite |
| Auth | — | JWT + bcryptjs |
| Validation | — | Zod |

## Maintainer Status

This project is currently maintained by the primary maintainer. Contributions, issues, and feedback are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for how to get involved.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
