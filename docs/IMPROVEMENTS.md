# LMR Stories - Missing Features & Areas of Improvement

## High Priority (Before Public Release)

### 1. RTL Support for Arabic
- **What:** Arabic text should render right-to-left. Currently layout is LTR only.
- **How:** Use `I18nManager.forceRTL()` when Arabic is selected. Wrap text in `<Text style={{ writingDirection: 'rtl' }}>`. Test all screens in RTL mode.
- **Effort:** Medium

### 2. User Authentication
- **What:** No user accounts yet. Progress is tied to a hardcoded `"default"` user ID.
- **How:** Add auth (Firebase Auth, Supabase Auth, or custom JWT). Create parent + child account models. Store user_id in AsyncStorage after login.
- **Effort:** Large

### 3. Offline Mode
- **What:** App requires API server to be running. No offline fallback.
- **How:** Cache stories locally with AsyncStorage/MMKV after first fetch. Show cached stories when API is unreachable. Queue quiz submissions for later sync.
- **Effort:** Medium

### 4. Error Handling & Loading States
- **What:** No skeleton screens, no error boundaries, minimal retry logic.
- **How:** Add React error boundaries around each screen. Add skeleton loading components. Add pull-to-refresh on story list.
- **Effort:** Small

### 5. Read-Along / Word Highlighting
- **What:** Audio plays but text doesn't highlight along with speech.
- **How:** Split story content into words/sentences. Use `expo-speech` events to track position. Highlight current word/sentence as audio plays.
- **Effort:** Large

---

## Medium Priority (Next Sprint)

### 6. More Languages
- **What:** Only EN/FR/AR. Users want Spanish, German, Italian, etc.
- **How:** Use the AI translate endpoint (`POST /api/generate/translate`) to batch-translate existing stories. Add language options to the UI picker.
- **Effort:** Small (AI does the work)

### 7. Interactive / Branching Stories
- **What:** Stories are linear. Kids love "choose your adventure" style.
- **How:** Add a `branches` field to story model. Each branch has a prompt ("What should the rabbit do?") + options that lead to different story segments. New screen or modified StoryScreen.
- **Effort:** Large

### 8. Parent Dashboard
- **What:** Parents can't see their child's progress outside the app.
- **How:** Web dashboard showing: stories read, quiz scores, time spent, achievement timeline. Could be a simple Next.js app consuming the same API.
- **Effort:** Large

### 9. Admin Panel
- **What:** No UI for managing stories, reviewing AI-generated content, or moderating.
- **How:** Build a simple admin web app (Next.js or React). CRUD for stories, translation management, AI generation controls, content approval workflow.
- **Effort:** Large

### 10. Push Notifications / Streaks
- **What:** No re-engagement mechanism. Kids open the app once and forget.
- **How:** Add `expo-notifications`. Track daily streaks in user_progress. Send reminders: "Your streak is 5 days! Read a story to keep it going!"
- **Effort:** Medium

### 11. Animations & Transitions
- **What:** UI is functional but static. Kids apps need juice.
- **How:** Add `react-native-reanimated` for: page transitions, quiz answer feedback (shake on wrong, bounce on right), achievement unlock celebrations (confetti), star rating animations.
- **Effort:** Medium

### 12. Image Illustrations
- **What:** Stories are text-only. Young kids (5-7) expect pictures.
- **How:** Use AI image generation (DALL-E, Midjourney API) to create illustrations per story. Store image URLs in story_translations table. Display in StoryScreen.
- **Effort:** Medium

---

## Low Priority (Future)

### 13. Premium / Subscription Model
- **What:** No monetization.
- **How:** Free tier: 10 stories. Premium: unlimited AI generation, all languages, audio narration with high-quality voices (ElevenLabs). Use RevenueCat for in-app purchases.
- **Effort:** Large

### 14. High-Quality Voice Narration
- **What:** expo-speech uses device TTS (robotic). Kids prefer warm, expressive voices.
- **How:** Integrate ElevenLabs or Amazon Polly. Pre-generate audio for seed stories. Store audio URLs in database. Stream audio in StoryScreen.
- **Effort:** Medium

### 15. Difficulty Adaptation
- **What:** Difficulty is manually set per story. No personalization.
- **How:** Track quiz scores over time. If child consistently scores 100%, suggest harder stories. If consistently below 50%, suggest easier ones. Add recommendation engine.
- **Effort:** Medium

### 16. Social Features
- **What:** No sharing, no friend lists, no leaderboards.
- **How:** Share achievements on social media. Add friend system for comparing progress. Class/group leaderboards for school use.
- **Effort:** Large

### 17. Content Pipeline Automation
- **What:** AI generates stories but no review/approval workflow.
- **How:** Status field on stories: `draft` → `in_review` → `published`. Admin reviews AI output before it reaches kids. Flag inappropriate content automatically.
- **Effort:** Medium

### 18. Analytics / Telemetry
- **What:** No insight into how kids use the app.
- **How:** Track: which stories are most popular, average quiz scores, drop-off points, session length. Use PostHog or Mixpanel (privacy-first, COPPA compliant).
- **Effort:** Medium

### 19. Accessibility
- **What:** No screen reader support, no high contrast mode, no font size adjustment.
- **How:** Add `accessibilityLabel` to all interactive elements. Support dynamic font scaling. Add high-contrast color theme option.
- **Effort:** Medium

### 20. Testing
- **What:** No automated tests.
- **How:** Unit tests for Zustand store logic (Jest). Component tests for screens (React Native Testing Library). API integration tests for server endpoints (Supertest). E2E tests with Detox or Maestro.
- **Effort:** Large

---

## Technical Debt

| Issue | Impact | Fix |
|-------|--------|-----|
| No rate limiting on API | DDoS risk | Add express-rate-limit middleware |
| No input validation | Injection risk | Add Zod/Joi schema validation on all POST routes |
| No API versioning | Breaking changes | Prefix routes with `/api/v1/` |
| No health check for DB/Redis in /health | Ops blindness | Check connections in health endpoint |
| Hardcoded API URL in mobile client | Deploy friction | Use env variable or Expo config |
| No CI/CD pipeline | Manual deploys | Add GitHub Actions for lint, test, build, deploy |
| No Swagger/OpenAPI docs | Onboarding friction | Add swagger-jsdoc to auto-generate API docs |
| Docker dev mode runs `npm run dev` | Slow restarts | Add nodemon or tsx watch mode |
| No database backups | Data loss risk | Add pg_dump cron job or use managed PostgreSQL |
