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

# Seed demo data (optional)
npm run seed

# Start dev server
npm run dev
```

Server runs at `http://localhost:3001`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run type-check` | TypeScript type check |
| `npm test` | Run basic health check test |
| `npm run db:push` | Push schema to database |
| `npm run seed` | Seed demo data |
| `npm run db:reset` | Reset database and re-seed |
| `npm run prisma:studio` | Open Prisma Studio |

## Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-change-me"
```

## API Endpoints

### Health
- `GET /api/health` — Health check

### Auth
- `POST /api/auth/register` — Register with phone + password
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user (requires auth)

### Tasks
- `GET /api/tasks` — List tasks (filter: `status`, `type`, `keyword`)
- `GET /api/tasks/:id` — Get task detail
- `POST /api/tasks` — Create task (requires auth)
- `POST /api/tasks/:id/accept` — Accept task (requires auth)
- `POST /api/tasks/:id/start` — Start picking (requires auth)
- `POST /api/tasks/:id/complete` — Mark complete (requires auth)
- `POST /api/tasks/:id/confirm` — Confirm completion (requires auth)
- `POST /api/tasks/:id/cancel` — Cancel task (requires auth)

### Demo Accounts (after seeding)

| Phone | Password | Name |
|-------|----------|------|
| 13800000001 | 123456 | 小明 |
| 13800000002 | 123456 | 小红 |
