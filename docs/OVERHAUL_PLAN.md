# LMR Stories — Full Overhaul Plan

## Context

The app needs to evolve from a prototype with hardcoded fake stories to a production-ready children's reading platform. Key gaps: no auth, no real story content, no community features, no configurable feature flags, limited UI polish for children, and no public/private story sharing model.

---

## Goals Summary

1. **Real stories (25-50)** — fetched from HuggingFace FairytaleQA dataset during seed
2. **Auth system** — username + password, JWT, children-safe sign-up flow
3. **Community stories** — user-created stories with public/private toggle + voting
4. **App config** — feature flags for AI, tabs, languages, community
5. **Production UI** — children-focused, RTL Arabic, no blocked flows, tabs on all devices

---

## Architecture Overview

```
React Native (Expo SDK 55) ──> Express.js API (port 3001)
  Auth Store (JWT)               ├── PostgreSQL 16 (TypeORM, migrations)
  App Store (stories/progress)   ├── Redis 7 (response caching)
  Config (feature flags)         └── Google Gemini 2.0 Flash (AI)

Navigation:
  Stack Root
    ├── (auth)/         # Login + Register (shown when no session)
    └── (tabs)/         # Main app (shown when authenticated)
          ├── index     # Official Stories
          ├── community # Community Stories (config-gated)
          ├── generate  # AI Create (config-gated)
          └── profile   # User Profile + My Stories
```

---

## Database Schema Changes

### New Tables (via migration `1740000000000-AuthAndCommunity.ts`)

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username varchar(50) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  display_name varchar(100),
  created_at TIMESTAMP DEFAULT now()
);

-- Sentinel user for legacy data
INSERT INTO users (id, username, password_hash, display_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'default', '', 'Default User');

CREATE TABLE story_votes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  value integer DEFAULT 1,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, story_id)
);
```

### Modified Tables

```sql
-- stories: add community columns
ALTER TABLE stories ADD COLUMN story_type varchar(20) DEFAULT 'official';
ALTER TABLE stories ADD COLUMN author_id uuid REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE stories ADD COLUMN is_public boolean DEFAULT true;
ALTER TABLE stories ADD COLUMN vote_count integer DEFAULT 0;

-- story_translations: add audio_content (already in entity, missing from migration)
ALTER TABLE story_translations ADD COLUMN IF NOT EXISTS audio_content text;

-- user_progress: migrate user_id varchar -> uuid FK
ALTER TABLE user_progress ADD COLUMN user_id_new uuid;
UPDATE user_progress SET user_id_new = '00000000-0000-0000-0000-000000000001';
ALTER TABLE user_progress DROP CONSTRAINT "UQ_user_progress";
ALTER TABLE user_progress DROP COLUMN user_id;
ALTER TABLE user_progress RENAME COLUMN user_id_new TO user_id;
ALTER TABLE user_progress ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_progress ADD CONSTRAINT FK_user_progress_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_progress ADD CONSTRAINT UQ_user_progress UNIQUE (user_id, story_id, language);

-- Same for user_achievements
```

---

## Phase 1: Backend — Auth System

### Files to Create
- `server/src/entities/User.ts` — TypeORM entity
- `server/src/entities/StoryVote.ts` — TypeORM entity
- `server/src/services/auth.ts` — bcrypt + JWT helpers
- `server/src/middleware/auth.ts` — `requireAuth` + `optionalAuth` Express middleware
- `server/src/routes/auth.ts` — POST /register, POST /login, GET /me

### Files to Modify
- `server/src/entities/Story.ts` — add `storyType`, `authorId`, `isPublic`, `voteCount`
- `server/src/entities/UserProgress.ts` — change `userId` to uuid FK
- `server/src/entities/UserAchievement.ts` — change `userId` to uuid FK
- `server/src/config/data-source.ts` — register User, StoryVote entities + new migration
- `server/src/server.ts` — mount `/api/auth` route, add `bcryptjs` + `jsonwebtoken` imports

### New Dependencies (server)
```json
"bcryptjs": "^2.4.3",
"jsonwebtoken": "^9.0.2",
"@types/bcryptjs": "^2.4.6",
"@types/jsonwebtoken": "^9.0.7"
```

### API Endpoints Added
```
POST /api/auth/register  { username, password, display_name? }
POST /api/auth/login     { username, password }
GET  /api/auth/me        (requireAuth) → user profile
```

---

## Phase 2: Backend — Real Stories

### Strategy
- Fetch from HuggingFace FairytaleQA: `https://datasets-server.huggingface.co/rows?dataset=benjleite%2FFairytaleQA-translated-french&config=default&split=train&offset=0&length=500`
- Dataset has: `story_name`, `story_section` (EN text chunks), `story_fr` (FR text chunks), QA pairs
- Group by `story_name` → concatenate sections → build full story
- Map QA pairs → quiz questions (3 per story max)
- Arabic: skip during seed, generate later via `/api/generate/translate`
- Target: 25-40 distinct fairy tale titles

### Files to Create
- `server/src/data/fetchFairytales.ts` — HuggingFace fetch + data transformation

### Files to Modify
- `server/src/data/seed.ts` — replace static array with `fetchFairytales()` call + fallback

### Seed Logic
```typescript
async function fetchFairytales(): Promise<SeedStory[]>
// 1. GET HuggingFace API (paginate: 2 pages of 250 rows)
// 2. Group rows by story_name
// 3. Per story: join story_section → content, story_fr → fr_content
// 4. Take first 3 QA pairs per story as quiz questions
// 5. Derive difficulty (word count), age_group (story complexity), theme (keyword match)
// 6. Return SeedStory[] with en + fr translations
```

---

## Phase 3: Backend — Community Stories & Voting

### Files to Create
- `server/src/routes/votes.ts` — POST /:id/vote, DELETE /:id/vote

### Files to Modify
- `server/src/routes/stories.ts`:
  - GET / — add `story_type` + `feed=community` filter params, include `vote_count`, `author_username`
  - POST / — apply `requireAuth`, set `authorId`, `storyType='community'`, `isPublic`
  - PATCH /:id — `requireAuth` + ownership check (toggle `isPublic`, edit title/content)
  - DELETE /:id — `requireAuth` + ownership check
- `server/src/routes/progress.ts` — use `optionalAuth`, prefer token userId over query param
- `server/src/routes/achievements.ts` — same `optionalAuth` pattern
- `server/src/routes/quizzes.ts` — same `optionalAuth` pattern
- `server/src/server.ts` — mount `/api/stories` votes router, add optionalAuth globally or per-route

### Community API Endpoints
```
GET  /api/stories?feed=community      # Public community stories, sorted by vote_count
POST /api/stories/:id/vote            # requireAuth — upvote a story
DELETE /api/stories/:id/vote          # requireAuth — remove vote
PATCH /api/stories/:id                # requireAuth + ownership — edit visibility
```

---

## Phase 4: App Config System

### File to Create: `src/config/appConfig.ts`
```typescript
export const appConfig = {
  // Feature flags
  enableAI: true,              // Show Generate tab
  enableCommunity: true,       // Show Community tab
  requireAuth: false,          // If true, guest access blocked (future)

  // Tabs to display (order matters)
  enabledTabs: ['stories', 'community', 'generate', 'profile'] as const,

  // Languages
  languages: ['en', 'fr', 'ar'] as const,
  defaultLanguage: 'en' as const,

  // API
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001',
} as const;
```

### File to Create: `server/src/config/appConfig.ts`
```typescript
export const serverConfig = {
  enableAI: !!process.env.GEMINI_API_KEY,
  enableCommunity: true,
  languages: ['en', 'fr', 'ar'],
  maxStoriesPerUser: 50,
};
// Also: GET /api/config endpoint returning serverConfig
```

---

## Phase 5: Mobile — Auth

### Files to Create
- `src/store/useAuthStore.ts` — Zustand auth store (login/register/logout/restoreSession)
- `src/screens/LoginScreen.tsx` — Children-friendly login UI
- `src/screens/RegisterScreen.tsx` — Username + password + display name
- `src/api/auth.ts` — POST /auth/login, POST /auth/register, GET /auth/me
- `app/(auth)/_layout.tsx` — Stack layout for auth screens
- `app/(auth)/login.tsx` — Route file → LoginScreen
- `app/(auth)/register.tsx` — Route file → RegisterScreen

### Files to Modify
- `src/api/client.ts` — Add `setAuthToken()` + inject `Authorization: Bearer` header
- `app/_layout.tsx` — On mount: `restoreSession()`, redirect to `/(auth)/login` if no user
- `src/types/index.ts` — Add `User`, `AuthState`, `AuthStackParamList`

### Auth Flow
```
App starts → restoreSession()
  ├── Token valid → go to /(tabs)/
  └── No token → go to /(auth)/login
         ├── Login success → store token → go to /(tabs)/
         └── "Register" link → /(auth)/register → same
```

### Auth Store Shape
```typescript
interface AuthState {
  user: { id: string; username: string; displayName: string } | null;
  token: string | null;
  login(username, password): Promise<void>;
  register(username, password, displayName?): Promise<void>;
  logout(): void;
  restoreSession(): Promise<void>;
}
// Token persisted in AsyncStorage under 'lmr_auth_token'
```

---

## Phase 6: Mobile — Community

### Files to Create
- `src/screens/CommunityScreen.tsx` — Community feed sorted by votes, voting UI
- `src/screens/WriteStoryScreen.tsx` — Form to write a story (title, content, theme, public toggle)
- `app/(tabs)/community.tsx` — Route → CommunityScreen
- `app/(tabs)/community/write.tsx` — Route → WriteStoryScreen (href: null — hidden from tab bar)

### Files to Modify
- `src/store/useAppStore.ts` — Add `communityStories`, `loadCommunityStories()`, `voteStory()`, `submitCommunityStory()`
- `src/types/index.ts` — Add `StoryType`, extend `StoryListItem` with `story_type`, `author_username`, `vote_count`, `user_has_voted`

### Community Screen Features
- Header: "Community Stories 🌟"
- FlatList sorted by `vote_count DESC`
- Each card: title, author `@username`, ❤️ vote count + tap-to-vote button
- FAB "Write a Story ✏️" (navigates to WriteStoryScreen)
- Empty state if no community stories yet

---

## Phase 7: Mobile — Navigation Overhaul

### Files to Modify
- `app/(tabs)/_layout.tsx` — Config-driven tabs:
  ```typescript
  // Always: Stories tab (📚), Profile tab (👤)
  // If appConfig.enableCommunity: Community tab (🌟)
  // If appConfig.enableAI: Generate tab (✨)
  ```
- `app/_layout.tsx` — Add auth guard + (auth) stack screen

### Tab Bar Design (Children-Friendly)
- Large icons (28px), labels always visible
- Active tab: filled emoji + colored tint
- Tab bar height: 70px (comfortable for small fingers)
- Background: white with subtle shadow

---

## Phase 8: Mobile — UI/UX Polish

### Files to Modify
- `src/constants/colors.ts` — Add children's palette: coral, mint, lavender, sunflower, sky, bubblegum
- `src/components/StoryCard.tsx` — Bigger fonts (18px title), colored backgrounds cycling per theme, community badge chip, vote count for community cards
- `src/screens/HomeScreen.tsx` — Section header "Official Stories 📚", language switcher improved, no loading blocks
- `src/screens/StoryScreen.tsx` — RTL support for Arabic (writingDirection, textAlign)
- `src/screens/QuizScreen.tsx` — RTL support for Arabic
- `src/screens/ProfileScreen.tsx` — Show `displayName/@username`, logout button, "My Stories" section for user-created stories
- `src/screens/GenerateScreen.tsx` — Wrap in `appConfig.enableAI` guard, add `isPublic` toggle, improved children-friendly picker UI

### RTL Support (`src/utils/rtl.ts`)
```typescript
import { I18nManager } from 'react-native';
export const isRTL = (lang: string) => lang === 'ar';
export const getTextStyle = (lang: string) => ({
  writingDirection: isRTL(lang) ? 'rtl' : 'ltr',
  textAlign: isRTL(lang) ? 'right' : 'left',
} as const);
```

---

## Complete File Inventory

### New Server Files (9)
| File | Purpose |
|------|---------|
| `server/src/entities/User.ts` | User entity (username, password_hash) |
| `server/src/entities/StoryVote.ts` | Vote entity (userId + storyId + value) |
| `server/src/migrations/1740000000000-AuthAndCommunity.ts` | DB schema migration |
| `server/src/services/auth.ts` | bcrypt + JWT helpers |
| `server/src/middleware/auth.ts` | requireAuth / optionalAuth middleware |
| `server/src/routes/auth.ts` | /api/auth/* endpoints |
| `server/src/routes/votes.ts` | Vote up/down endpoints |
| `server/src/data/fetchFairytales.ts` | HuggingFace dataset fetcher |
| `server/src/config/appConfig.ts` | Server feature flags |

### Modified Server Files (8)
| File | Change |
|------|--------|
| `server/src/entities/Story.ts` | + storyType, authorId, isPublic, voteCount |
| `server/src/entities/UserProgress.ts` | userId: varchar → uuid FK |
| `server/src/entities/UserAchievement.ts` | userId: varchar → uuid FK |
| `server/src/config/data-source.ts` | Register new entities + migration |
| `server/src/server.ts` | Mount auth + votes routes |
| `server/src/routes/stories.ts` | story_type filters, auth guards, community endpoint |
| `server/src/routes/progress.ts` | optionalAuth, token userId |
| `server/src/routes/achievements.ts` | optionalAuth, token userId |
| `server/src/routes/quizzes.ts` | optionalAuth, token userId |
| `server/src/data/seed.ts` | Replace static data with HuggingFace fetch |

### New Mobile Files (10)
| File | Purpose |
|------|---------|
| `src/config/appConfig.ts` | Client-side feature flags |
| `src/store/useAuthStore.ts` | Auth state (user, token, login/logout) |
| `src/api/auth.ts` | Auth API calls |
| `src/screens/LoginScreen.tsx` | Children-friendly login |
| `src/screens/RegisterScreen.tsx` | Username + password sign-up |
| `src/screens/CommunityScreen.tsx` | Community story feed + voting |
| `src/screens/WriteStoryScreen.tsx` | Write/submit a community story |
| `src/utils/rtl.ts` | RTL helpers for Arabic |
| `app/(auth)/_layout.tsx` | Auth stack navigator |
| `app/(auth)/login.tsx` | Login route |
| `app/(auth)/register.tsx` | Register route |
| `app/(tabs)/community.tsx` | Community tab route |

### Modified Mobile Files (9)
| File | Change |
|------|--------|
| `src/api/client.ts` | Auth token injection |
| `src/types/index.ts` | + User, StoryType, AuthStack types |
| `src/store/useAppStore.ts` | + community actions, vote, submit |
| `src/constants/colors.ts` | + children's color palette |
| `src/components/StoryCard.tsx` | Bigger fonts, community badge, vote display |
| `src/screens/HomeScreen.tsx` | Section header, improved lang switcher |
| `src/screens/StoryScreen.tsx` | RTL support |
| `src/screens/QuizScreen.tsx` | RTL support |
| `src/screens/ProfileScreen.tsx` | User info, logout, my stories |
| `src/screens/GenerateScreen.tsx` | isPublic toggle, AI guard |
| `app/_layout.tsx` | Auth guard + (auth) stack |
| `app/(tabs)/_layout.tsx` | Config-driven tabs, children UX |

---

## Implementation Order (Sequential)

```
BACKEND
□ 1.  User + StoryVote entities
□ 2.  Migration 1740000000000-AuthAndCommunity.ts
□ 3.  Update data-source.ts (register entities + migration)
□ 4.  auth.ts service (bcrypt + JWT)
□ 5.  auth.ts middleware (requireAuth + optionalAuth)
□ 6.  auth.ts routes (register/login/me)
□ 7.  Update server.ts (mount auth routes + install bcryptjs/jsonwebtoken)
□ 8.  Update Story entity (storyType, authorId, isPublic, voteCount)
□ 9.  Update UserProgress + UserAchievement entities (userId → uuid)
□ 10. Update stories.ts routes (auth guards, community filters)
□ 11. Update progress.ts + achievements.ts + quizzes.ts (optionalAuth)
□ 12. votes.ts route
□ 13. fetchFairytales.ts (HuggingFace fetch + transform)
□ 14. Update seed.ts (use fetchFairytales + fallback)
□ 15. server appConfig.ts + GET /api/config

MOBILE
□ 16. appConfig.ts (feature flags)
□ 17. Update types/index.ts (User, StoryType, etc.)
□ 18. Update src/api/client.ts (auth token injection + setAuthToken)
□ 19. src/api/auth.ts
□ 20. useAuthStore.ts
□ 21. LoginScreen.tsx
□ 22. RegisterScreen.tsx
□ 23. app/(auth)/_layout.tsx + login.tsx + register.tsx
□ 24. Update app/_layout.tsx (auth guard)
□ 25. Update app/(tabs)/_layout.tsx (config-driven tabs)
□ 26. Update useAppStore.ts (community actions)
□ 27. CommunityScreen.tsx
□ 28. WriteStoryScreen.tsx
□ 29. app/(tabs)/community.tsx
□ 30. Update HomeScreen.tsx (official stories section)
□ 31. Update ProfileScreen.tsx (user info + logout + my stories)
□ 32. Update GenerateScreen.tsx (isPublic toggle + AI guard)
□ 33. Update StoryCard.tsx (bigger fonts, community badge, vote)
□ 34. src/utils/rtl.ts
□ 35. Update StoryScreen.tsx + QuizScreen.tsx (RTL)
□ 36. Update colors.ts (children's palette)
□ 37. Update StoryCard.tsx (colorful themed backgrounds)
```

---

## Verification Checklist

### Backend
```bash
cd server && npm install   # installs bcryptjs, jsonwebtoken
npm run migration:run      # runs both migrations
npm run seed               # fetches 25-40 stories from HuggingFace
# Verify:
curl http://localhost:3001/api/stories?language=en        # → 25-40 official stories
curl http://localhost:3001/api/config                     # → feature flags
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}' # → token
curl -X POST http://localhost:3001/api/auth/login ...     # → token
curl .../api/stories?feed=community                       # → empty initially
```

### Mobile
1. App launches → redirects to Login screen
2. Register a new account → lands on Stories tab
3. Browse official stories (25-40 stories visible)
4. Open a story → Read → take quiz → see stars
5. Profile tab: shows username, stats, achievements
6. Generate tab: create AI story with public/private toggle
7. Community tab: see public stories, vote, write your own
8. Switch to Arabic → text displays RTL correctly
9. Tab bar visible at bottom on all screen sizes
10. `appConfig.enableAI = false` → Generate tab hidden
11. `appConfig.enableCommunity = false` → Community tab hidden

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Auth tokens | JWT (30-day expiry, AsyncStorage) | Simple, no server sessions needed |
| Password hashing | bcrypt (12 rounds) | Industry standard |
| Story fetch | HuggingFace FairytaleQA EN+FR, skip AR | Dataset has EN+FR; AR via Gemini later |
| userId migration | Sentinel UUID user for legacy data | Zero data loss on migration |
| Community stories | Separate `story_type` column on stories table | Reuses all existing story infrastructure |
| Vote count | Denormalized `vote_count` on stories | Fast sorting, no join needed |
| Feature flags | Static `appConfig.ts` + server `/api/config` | Instant compile-time guards + runtime override |
| RTL Arabic | `I18nManager.forceRTL` + per-component `writingDirection` | Full RTL layout + text support |
| Tab bar | Config-driven array, always show Stories + Profile | Flexible, can add/remove tabs via config |
