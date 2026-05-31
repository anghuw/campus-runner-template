# 🏃 Campus Runner

A full-stack campus errands app starter — Expo React Native frontend + Express/Prisma backend.

> **v0.2.0** — Backend starter with SQLite, JWT auth, and task CRUD API. Frontend still works in mock-data mode by default.

## What's Included

### Frontend (Expo React Native)
- 10 screen pages with mock data
- Bottom tab + stack navigation
- Zustand state management
- TypeScript strict mode
- Optional API client (connects to backend when configured)

### Backend (Express + Prisma)
- Express + TypeScript server
- Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- JWT authentication (register/login)
- Task CRUD with full lifecycle (pending → accepted → picking → delivering → completed)
- Zod input validation
- Seed script with demo data

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

## Quick Start

### 1. Backend

```bash
cd server

# Install
npm install

# Setup database
cp .env.example .env
npm run db:push

# Seed demo data (optional)
npm run seed

# Start dev server
npm run dev
# → http://localhost:3001
```

### 2. Frontend (Mock Mode — default)

```bash
# In project root
npm install
npm start
# → Uses mock data, no backend needed
```

### 3. Frontend (API Mode)

```bash
# Create .env file in project root
echo "EXPO_PUBLIC_API_BASE_URL=http://localhost:3001" > .env

npm start
# → Connects to backend API
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

## Environment Variables

### Frontend (`.env`)

```env
# Leave empty for mock mode (default)
# Set to backend URL for API mode
EXPO_PUBLIC_API_BASE_URL=
```

### Backend (`server/.env`)

```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-change-me"
```

> ⚠️ Never commit `.env` files. Only `.env.example` files are tracked.

## Project Structure

```
campus-runner/
├── App.tsx                        # Frontend entry
├── src/
│   ├── api/                       # API client (new in v0.2.0)
│   │   ├── client.ts              # HTTP client with mock/API mode
│   │   ├── tasks.ts               # Task API calls
│   │   ├── auth.ts                # Auth API calls
│   │   └── index.ts
│   ├── data/mockData.ts           # Mock data
│   ├── navigation/                # React Navigation
│   ├── pages/                     # 10 screen pages
│   ├── stores/                    # Zustand
│   ├── types/                     # TypeScript types
│   └── utils/                     # Helpers
├── server/                        # Backend (new in v0.2.0)
│   ├── prisma/schema.prisma       # Database schema
│   ├── src/
│   │   ├── index.ts               # Express server
│   │   ├── routes/auth.ts         # Auth endpoints
│   │   ├── routes/tasks.ts        # Task endpoints
│   │   ├── middleware/auth.ts     # JWT middleware
│   │   ├── utils/                 # Prisma client, helpers
│   │   └── __tests__/             # Basic tests
│   ├── seed.ts                    # Demo data seeder
│   ├── .env.example               # Backend env template
│   └── package.json
├── docs/ROADMAP.md                # Development roadmap
├── .github/                       # CI, issue templates, PR template
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full plan.

**Done (v0.2.0):**
- ✅ Frontend template with mock data
- ✅ Backend API with auth and task CRUD
- ✅ SQLite dev database with Prisma
- ✅ Seed script with demo data
- ✅ API client with mock/API mode switch
- ✅ CI with type-check for both frontend and backend

**Next:**
- Connect frontend screens to backend API
- Real-time chat (WebSocket)
- Push notifications
- Map integration
- Unit and E2E tests

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
