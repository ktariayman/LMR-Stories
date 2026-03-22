# LMR Stories - Team Workflow

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Expo Go app on your phone (for mobile testing)
- (Optional) Gemini API key for AI features

### 1. Start the backend

```bash
# From project root — starts PostgreSQL, Redis, and API server
docker-compose up -d

# Run database migrations
cd server
npm install
npm run migration:run

# Seed with 10 stories in EN/FR/AR
npm run seed
```

The API is now running at `http://localhost:3001`.

### 2. Start the mobile app

```bash
# From project root
npm install
npm start
```

Scan the QR code with Expo Go on your phone, or press `w` for web.

### 3. Verify everything works

```bash
# Health check
curl http://localhost:3001/api/health

# List stories
curl http://localhost:3001/api/stories?language=en

# Get a specific story
curl http://localhost:3001/api/stories/<id>?language=fr
```

---

## Development Workflow

### Adding a new story manually

```bash
curl -X POST http://localhost:3001/api/stories \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-new-story",
    "difficulty": "easy",
    "age_group": "5-7",
    "theme": "friendship",
    "theme_emoji": "🎈",
    "translations": [
      {
        "language": "en",
        "title": "My New Story",
        "content": "Once upon a time...",
        "summary": "A story about friendship."
      }
    ],
    "quiz": [
      {
        "language": "en",
        "question": "Who was the main character?",
        "options": ["Alice", "Bob", "Charlie"],
        "correct_answer": "Alice"
      }
    ]
  }'
```

### Generating a story with AI

```bash
curl -X POST http://localhost:3001/api/generate/story \
  -H "Content-Type: application/json" \
  -d '{"theme": "kindness", "difficulty": "easy", "age_group": "5-7", "language": "en"}'
```

### Translating a story with AI

```bash
curl -X POST http://localhost:3001/api/generate/translate \
  -H "Content-Type: application/json" \
  -d '{"story_id": "<uuid>", "target_language": "fr"}'
```

### Creating a new TypeORM migration

1. Modify entities in `server/src/entities/`
2. Generate migration: `npm run migration:run` (TypeORM auto-generates diff)
3. Or write manual migration in `server/src/migrations/`

---

## Frontend Development

### Adding a new screen

1. Create screen in `src/screens/NewScreen.tsx`
2. Add to navigation in `App.tsx` (tab or stack)
3. Add types to `src/types/index.ts` if needed
4. Add API calls to `src/api/` if needed
5. Update Zustand store in `src/store/useAppStore.ts`

### Adding a new component

1. Create in `src/components/`
2. Use colors from `src/constants/colors.ts`
3. Use large font sizes (min 16px for body, 20px+ for headings)
4. Big touch targets (min 44px height for buttons)

### API Client

All API calls go through `src/api/client.ts`. Update `API_BASE_URL` there if your server is at a different address.

---

## Testing with Kids

### Checklist before handing the app to a child

- [ ] Backend is running (`docker-compose up`)
- [ ] Database is seeded (`npm run seed`)
- [ ] App loads story list on Home Screen
- [ ] Tapping a story shows full text
- [ ] Audio play button works (TTS reads the story)
- [ ] Quiz shows 3 questions with answer options
- [ ] Results show stars and score
- [ ] Profile tab shows achievements
- [ ] Language tabs switch between EN/FR/AR
- [ ] Completed stories show checkmark

### What to watch for during testing

- Do kids understand the UI without help?
- Is the text large enough?
- Are buttons easy to tap?
- Do they finish reading before tapping "Start Quiz"?
- Do they understand the quiz questions?
- Do they want to read another story after finishing?
- Do achievements motivate them?

---

## Docker Commands

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f server

# Stop everything
docker-compose down

# Reset database (destroys data)
docker-compose down -v
docker-compose up -d
cd server && npm run migration:run && npm run seed

# Rebuild after code changes
docker-compose up --build -d
```

---

## Environment Variables

### Server (`server/.env`)
```env
PORT=3001
DATABASE_URL=postgres://lmr:lmr_password@localhost:5432/lmr_stories
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_key_here    # Optional — AI features won't work without it
```

### Docker Compose (root `.env`)
```env
GEMINI_API_KEY=your_key_here
```

### Mobile App
Update `API_BASE_URL` in `src/api/client.ts` to point to your server.
- Local development: `http://localhost:3001` (web) or `http://<your-ip>:3001` (mobile)
- Production: your deployed server URL
