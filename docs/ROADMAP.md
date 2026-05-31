# Roadmap

This document outlines the planned development roadmap for Campus Runner.

> ⚠️ Items are planned, not completed. Check the [Changelog](../CHANGELOG.md) for what's already shipped.

## Phase 1: Frontend Template ✅ (v0.1.0 — Current)

- [x] Expo React Native project setup
- [x] Bottom tab + stack navigation
- [x] 10 screen pages with mock data
- [x] Zustand state management
- [x] TypeScript with strict mode
- [x] Open-source repository structure

## Phase 2: Backend & Authentication (v0.2.0)

- [ ] Node.js + Express backend server
- [ ] PostgreSQL database with Prisma ORM
- [ ] User registration and login (JWT auth)
- [ ] RESTful API for tasks and users
- [ ] Connect frontend to real API
- [ ] Environment variable configuration

## Phase 3: Core Features (v0.3.0)

- [ ] Real task publishing and acceptance flow
- [ ] Order status state machine (pending → accepted → picking → delivering → completed)
- [ ] User profile management
- [ ] Rating and review system
- [ ] Search with backend filtering

## Phase 4: Location & Maps (v0.4.0)

- [ ] Real location integration with expo-location
- [ ] Map view for nearby tasks
- [ ] Distance-based task sorting
- [ ] Delivery route display

## Phase 5: Real-time & Notifications (v0.5.0)

- [ ] WebSocket-based real-time chat
- [ ] Push notifications (expo-notifications)
- [ ] Order status change alerts
- [ ] New task notifications for runners

## Phase 6: Quality & Polish (v0.6.0)

- [ ] Unit tests with Jest
- [ ] E2E tests with Detox
- [ ] CI/CD pipeline improvements
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Dark mode support

## Phase 7: Production Release (v1.0.0)

- [ ] EAS Android build
- [ ] App store submission preparation
- [ ] Admin dashboard (web)
- [ ] Content moderation
- [ ] Privacy policy and terms of service
- [ ] Production deployment guide

---

## How to Contribute

See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to get involved.

Pick any unchecked item above and open a PR!
