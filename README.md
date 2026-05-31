# 🏃 Campus Runner

A React Native frontend template for a campus errands app, built with Expo.

> **Note:** This is currently a **frontend template with mock data**. There is no backend, no authentication, and no real data persistence yet. See [Roadmap](docs/ROADMAP.md) for planned features.

## What's Included

- 10 screen pages with realistic mock data
- Bottom tab navigation + stack navigation
- Zustand state management
- TypeScript with strict mode
- Ready-to-extend project structure

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 56 + React Native 0.85 |
| Navigation | React Navigation 7 (Stack + Bottom Tabs) |
| State | Zustand 5 |
| Language | TypeScript 6 |
| Icons | @expo/vector-icons (Feather) |
| Dates | date-fns |

## Current Features

| Feature | Status |
|---------|--------|
| Home page with task list & category filters | ✅ Mock data |
| Search tasks by keyword | ✅ Mock data |
| Publish a new task (form) | ✅ UI only |
| Order list with tabs (published / accepted) | ✅ Mock data |
| Order detail with status timeline | ✅ Mock data |
| Chat page with message bubbles | ✅ UI only |
| Messages list | ✅ Mock data |
| User profile page | ✅ Mock data |
| Runner profile page | ✅ Mock data |
| Rating page with stars | ✅ UI only |
| Backend API | ❌ Not yet |
| Real authentication | ❌ Not yet |
| Real data persistence | ❌ Not yet |
| Map / location | ❌ Not yet |
| Push notifications | ❌ Not yet |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm
- [Expo Go](https://expo.dev/go) app on your phone (or Android Studio / Xcode for simulators)

### Installation

```bash
# Clone the repo
git clone https://github.com/anghuw/campus-runner-template.git
cd campus-runner-template

# Install dependencies
npm install

# Start the dev server
npm start
```

Then scan the QR code with Expo Go, or press `a` for Android simulator / `i` for iOS simulator.

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
campus-runner/
├── App.tsx                       # App entry point
├── index.ts                      # Expo registration
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── tsconfig.json                 # TypeScript config
├── package.json
├── assets/                       # Icons and splash images
│   ├── icon.png
│   ├── splash-icon.png
│   └── ...
├── docs/
│   └── ROADMAP.md                # Development roadmap
└── src/
    ├── data/
    │   └── mockData.ts           # Mock data for all screens
    ├── navigation/
    │   └── AppNavigator.tsx      # Tab + stack navigation setup
    ├── pages/
    │   ├── HomePage.tsx          # Task list with filters
    │   ├── OrdersPage.tsx        # Order list with tabs
    │   ├── PublishPage.tsx       # Task publish form
    │   ├── MessagesPage.tsx      # Conversation list
    │   ├── ProfilePage.tsx       # User profile
    │   ├── OrderDetailPage.tsx   # Order detail & timeline
    │   ├── ChatPage.tsx          # Chat messages
    │   ├── RunnerPage.tsx        # Runner profile
    │   ├── SearchPage.tsx        # Search with filters
    │   └── RatingPage.tsx        # Star rating & review
    ├── stores/
    │   └── useStore.ts           # Zustand global store
    ├── types/
    │   └── index.ts              # TypeScript interfaces
    └── utils/
        └── index.ts              # Formatting helpers
```

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full development plan.

**Next up:**
1. Backend API (Node.js + Express + Prisma + PostgreSQL)
2. User authentication (JWT)
3. Connect frontend to real API
4. Real order flow

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

[MIT](LICENSE)
