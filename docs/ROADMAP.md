# Roadmap

This document outlines the planned development roadmap for Campus Runner.

> Items are planned, not completed. Check the [Changelog](../CHANGELOG.md) for what's shipped.

## Phase 1: Frontend Template ✅ (v0.1.0)

- [x] Expo React Native project setup
- [x] Bottom tab + stack navigation (10 screens)
- [x] Zustand state management with mock data
- [x] TypeScript strict mode
- [x] Open-source repository structure

## Phase 2: Backend Starter ✅ (v0.2.0)

- [x] Express + TypeScript server
- [x] Prisma ORM with SQLite (dev)
- [x] User model and auth (register/login/JWT)
- [x] Task model with full CRUD API
- [x] Zod input validation
- [x] Seed script with demo data
- [x] Frontend API client with mock/API mode switch
- [x] CI with type-check for frontend + backend

## Phase 3: Connect Frontend to Backend (v0.3.0)

- [ ] Connect HomePage to `GET /api/tasks`
- [ ] Connect TaskDetailPage to `GET /api/tasks/:id`
- [ ] Connect PublishPage to `POST /api/tasks`
- [ ] Connect auth screens to backend
- [ ] Token storage with expo-secure-store
- [ ] Loading and error states for API calls

## Phase 4: Real Order Flow (v0.4.0)

- [ ] Full order state machine (pending → accepted → picking → delivering → completed)
- [ ] Order acceptance and runner assignment
- [ ] Order confirmation by publisher
- [ ] Order history and filtering
- [ ] Review and rating system

## Phase 5: Location & Maps (v0.5.0)

- [ ] Real location with expo-location
- [ ] Map view for nearby tasks
- [ ] Distance-based sorting
- [ ] Delivery route display

## Phase 6: Real-time & Notifications (v0.6.0)

- [ ] WebSocket chat (Socket.io)
- [ ] Push notifications (expo-notifications)
- [ ] Order status alerts
- [ ] New task notifications for runners

## Phase 7: Quality & Polish (v0.7.0)

- [ ] Unit tests (Jest)
- [ ] API integration tests
- [ ] E2E tests (Detox)
- [ ] CI: run tests on PR
- [ ] Accessibility improvements
- [ ] Dark mode support

## Phase 8: Production (v1.0.0)

- [ ] PostgreSQL for production
- [ ] EAS Android build
- [ ] Admin dashboard (web)
- [ ] Content moderation
- [ ] Privacy policy and terms of service
- [ ] Production deployment guide

---

Pick any unchecked item and open a PR! See [CONTRIBUTING.md](../CONTRIBUTING.md).
