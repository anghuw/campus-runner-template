# Campus Runner — Backend

Express + Prisma + SQLite backend for the Campus Runner app.

## Quick Start

```bash
cd server

# Install dependencies
npm install

# Setup database
cp .env.example .env
npm run db:push

# Seed demo data
npm run seed

# Start dev server
npm run dev
# → http://localhost:3001
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run type-check` | TypeScript type check |
| `npm test` | Run integration tests (server must be running) |
| `npm run db:push` | Push schema to database |
| `npm run seed` | Seed demo data |
| `npm run db:reset` | Reset database and re-seed |
| `npm run prisma:studio` | Open Prisma Studio |

## Running Tests

Tests require the server to be running:

```bash
# Terminal 1: start server
npm run dev

# Terminal 2: run tests
npm test
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-in-production"
```

## API Endpoints

### Health
- `GET /api/health` — Health check

### Auth
- `POST /api/auth/register` — Register (phone, nickname, password, studentId?)
- `POST /api/auth/login` — Login (phone, password)
- `GET /api/auth/me` — Get current user (requires Bearer token)

### Tasks
- `GET /api/tasks` — List tasks (query: status, type, keyword)
- `GET /api/tasks/:id` — Task detail
- `POST /api/tasks` — Create task (requires auth)
- `POST /api/tasks/:id/accept` — Accept task (requires auth)
- `POST /api/tasks/:id/start` — Start picking (requires auth)
- `POST /api/tasks/:id/complete` — Mark complete (requires auth)
- `POST /api/tasks/:id/confirm` — Confirm completion (requires auth)
- `POST /api/tasks/:id/cancel` — Cancel task (requires auth)

## Demo Accounts (after seeding)

| Phone | Password | Name |
|-------|----------|------|
| 13800000001 | 123456 | 小明 |
| 13800000002 | 123456 | 小红 |

## Test Coverage

Integration tests cover:
- ✅ Health check
- ✅ User registration
- ✅ User login
- ✅ Get current user (with token)
- ✅ 401 on missing token
- ✅ List tasks
- ✅ Create task
- ✅ 401 on create without token
- ✅ Accept task (cross-user)
