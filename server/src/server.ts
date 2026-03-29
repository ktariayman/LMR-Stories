import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './config/data-source';
import { connectRedis } from './config/redis';
import { serverConfig } from './config/appConfig';
import storiesRouter from './routes/stories';
import quizzesRouter from './routes/quizzes';
import progressRouter from './routes/progress';
import generateRouter from './routes/generate';
import achievementsRouter from './routes/achievements';
import authRouter from './routes/auth';
import votesRouter from './routes/votes';

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// CORS — restrict origins in production, allow all in development
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : undefined;

if (isProduction && !allowedOrigins) {
  console.warn('WARNING: CORS_ORIGINS is not set in production. All cross-origin requests will be blocked.');
}

app.use(cors({
  origin: isProduction
    ? allowedOrigins ?? false   // block all if no origins configured in production
    : allowedOrigins ?? true,   // allow all in development
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));

// Global rate limit: 100 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// Stricter rate limit for auth endpoints: 10 requests per minute
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later.' },
});

// Stricter rate limit for AI generation: 5 requests per minute
const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many generation requests, please try again later.' },
});

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/stories', quizzesRouter);
app.use('/api/stories', votesRouter);
app.use('/api/progress', progressRouter);
app.use('/api/generate', generateLimiter, generateRouter);
app.use('/api/achievements', achievementsRouter);

// Config endpoint
app.get('/api/config', (_req, res) => {
  res.json({ data: serverConfig });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler — hide internal details in production
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    error: isProduction ? 'Internal server error' : err.message,
  });
});

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  await connectRedis();

  app.listen(PORT, () => {
    console.log(`LMR Stories API running on http://localhost:${PORT}`);
  });
}

bootstrap();
