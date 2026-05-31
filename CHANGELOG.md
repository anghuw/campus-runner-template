# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-05-31

### Added
- **Frontend API integration**: HomePage fetches tasks from backend in API mode
- **Frontend API integration**: PublishPage creates tasks via backend API in API mode
- **Login/Registration page** (`LoginPage.tsx`) with mock and API mode support
- **Auth token management** in Zustand store (login, register, logout, loadUser)
- **API client auth headers**: automatically attaches `Authorization: Bearer <token>` when logged in
- **Integration tests** for backend: health, register, login, getMe, tasks CRUD, accept task, 401 checks (21 assertions)
- **CI updated**: backend job now runs `npm test` with test database setup

### Changed
- `useStore.ts` extended with auth state and API mode actions (fetchTasks, createTask, acceptTask)
- `HomePage.tsx` uses fetchTasks on mount when in API mode
- `PublishPage.tsx` calls createTask when in API mode, prompts login if not authenticated
- `AppNavigator.tsx` added Login screen
- `.github/workflows/ci.yml` updated with test execution step
- `server/README.md` updated with test instructions

### Notes
- Mock mode still works by default (no backend needed)
- API mode activates when `EXPO_PUBLIC_API_BASE_URL` is set
- OrderDetailPage, OrdersPage, ProfilePage still use mock data only
- Not production-ready

## [0.2.0] - 2026-05-31

### Added
- Backend server (Express + TypeScript + Prisma + SQLite)
- JWT auth: register, login, getMe
- Task CRUD API with lifecycle
- Zod input validation
- Seed script with demo data
- Frontend API client with mock/API mode switch
- .env.example for frontend and backend
- CI: frontend + backend type-check

## [0.1.0] - 2026-05-31

### Added
- Initial frontend template with Expo SDK 56 + React Native 0.85
- 10 screen pages with mock data
- Zustand state management
- TypeScript strict mode
- MIT License
