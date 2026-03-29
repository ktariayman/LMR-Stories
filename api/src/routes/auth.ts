import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { hashPassword, verifyPassword, signToken } from '../services/auth';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../middleware/schemas';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { username, password, display_name } = req.body;

    const repo = AppDataSource.getRepository(User);
    const existing = await repo.findOne({ where: { username: username.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await hashPassword(password);
    const user = repo.create({
      username: username.toLowerCase(),
      passwordHash,
      displayName: display_name || username,
    });
    const saved = await repo.save(user);

    const token = signToken({ userId: saved.id, username: saved.username });
    res.status(201).json({
      data: {
        token,
        user: { id: saved.id, username: saved.username, displayName: saved.displayName },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { username: username.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = signToken({ userId: user.id, username: user.username });
    res.json({
      data: {
        token,
        user: { id: user.id, username: user.username, displayName: user.displayName },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id: req.user!.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      data: { id: user.id, username: user.username, displayName: user.displayName },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
