# LMR Stories - Project Context

## What is this?
A React Native (Expo) mobile app for children aged 5-10 to read multilingual stories and take quizzes. Backed by an Express.js API with PostgreSQL + Redis.

## Architecture
```
/                     # React Native (Expo) mobile app
  /src
    /api              # API client (fetches from Express backend)
    /components       # Reusable UI components
    /screens          # App screens (Home, Story, Quiz, Profile, Generate)
    /store            # Zustand state management
    /types            # TypeScript interfaces
    /constants        # Colors, fonts
  App.tsx             # Root with bottom tabs + stack navigation

/server               # Express.js API (separate package.json)
  /src
    /entities         # TypeORM entities (PostgreSQL)
    /migrations       # TypeORM migrations
    /routes           # REST API endpoints
    /services         # AI (Gemini), Cache (Redis)
    /config           # Database + Redis config
    /data             # Seed script with 10 stories × 3 languages
```

## Tech Stack
- **Mobile**: React Native + Expo SDK 55, TypeScript, React Navigation (stack + bottom tabs), Zustand
- **Backend**: Express.js, TypeORM, PostgreSQL 16, Redis 7, Google Gemini API
- **Infra**: Docker Compose (postgres, redis, server)

## Key Commands
```bash
# Mobile app
npm start              # Start Expo dev server
npm run web            # Start web version

# Backend
cd server
npm run dev            # Start server (ts-node, port 3001)
npm run seed           # Seed DB with 10 stories in en/fr/ar
npm run migration:run  # Run TypeORM migrations
npm run build          # Compile TypeScript

# Docker (from root)
docker-compose up -d   # Start postgres + redis + server
```

## API Endpoints
- `GET /api/stories?language=en&difficulty=easy&theme=kindness`
- `GET /api/stories/:id?language=en`
- `POST /api/stories/:id/quiz/submit` — body: `{ answers: [...], language }`
- `GET /api/progress/stats`
- `GET /api/achievements`
- `POST /api/generate/story` — body: `{ theme, difficulty, age_group, language }`
- `POST /api/generate/translate` — body: `{ story_id, target_language }`

## Languages
Currently: English (en), French (fr), Arabic (ar). RTL support needed for Arabic.

## Environment Variables
- Root `.env`: `GEMINI_API_KEY` (for docker-compose)
- `server/.env`: `PORT`, `DATABASE_URL`, `REDIS_URL`, `GEMINI_API_KEY`
- Mobile: API base URL configured in `src/api/client.ts`
