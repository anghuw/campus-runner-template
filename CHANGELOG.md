# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-31

### Added
- **Backend server** (`server/`) with Express + TypeScript + Prisma + SQLite
- User registration and login with JWT authentication
- Task CRUD API: create, list, detail, accept, start, complete, confirm, cancel
- Zod input validation for all endpoints
- Prisma schema with User, Task, Category models
- Seed script with demo users and tasks
- API health check endpoint (`GET /api/health`)
- **Frontend API client** (`src/api/`) with mock/API mode switch
- `EXPO_PUBLIC_API_BASE_URL` env var to toggle between mock and API mode
- Backend `.env.example` and frontend `.env.example`
- CI workflow updated: frontend + backend type-check
- `type-check` script added to both frontend and backend `package.json`
- `server/README.md` with setup instructions and API docs

### Changed
- Updated `docs/ROADMAP.md` with v0.2.0 completed items
- Updated root `README.md` to reflect full-stack starter status
- Updated `.github/workflows/ci.yml` with separate frontend/backend jobs

### Notes
- Frontend still works in mock-data mode by default (no backend required)
- API client is ready but not all screens are connected to backend yet
- Backend uses SQLite for development; switch DATABASE_URL for PostgreSQL in production

## [0.1.0] - 2026-05-31

### Added
- Initial frontend template with Expo SDK 56 + React Native 0.85
- 10 screen pages with mock data
- Bottom tab + stack navigation
- Zustand state management
- TypeScript strict mode
- MIT License
