# Demo Guide

How to run Campus Runner in different modes.

## Mode 1: Mock Mode (no backend)

The simplest way to see the app running. Uses built-in mock data, no server needed.

```bash
# In project root
npm install
npm start
```

- Press `a` for Android simulator, `i` for iOS simulator, or scan QR with Expo Go
- All 10 screens work with mock data
- Login page accepts any phone/password in mock mode

## Mode 2: Full-Stack Mode

Connects the frontend to a real backend API.

### Step 1: Start the backend

```bash
cd server
npm install
cp .env.example .env
npm run db:push     # create SQLite database
npm run seed        # insert demo users and tasks
npm run dev         # starts at http://localhost:3001
```

### Step 2: Configure the frontend

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Step 3: Start the frontend

```bash
# In project root (another terminal)
npm start
```

### Step 4: Try it out

1. Open the app
2. Tap the user icon (top right) to go to Login
3. Login with demo account: `13800000001` / `123456`
4. Go to Home — tasks are fetched from the backend
5. Tap "+" to publish a new task — it's saved to the database
6. Check the database: `cd server && npm run prisma:studio`

## Mode 3: API Testing (curl)

Test the backend directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13900000001","nickname":"Test","password":"test123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800000001","password":"123456"}'

# List tasks
curl http://localhost:3001/api/tasks

# Create task (use token from login response)
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"帮我取快递","type":"express","pickupLocation":"菜鸟驿站","deliveryLocation":"7号楼","reward":5,"contactInfo":"13800000001"}'
```

## What's Mock vs API

| Feature | Mock Mode | API Mode |
|---------|-----------|----------|
| Task list (Home) | Built-in data | `GET /api/tasks` |
| Task detail | Built-in data | Built-in data (not yet connected) |
| Publish task | Local only | `POST /api/tasks` |
| Login/Register | Accepts anything | Real JWT auth |
| Orders page | Built-in data | Built-in data (not yet connected) |
| Profile | Built-in data | Built-in data (not yet connected) |
