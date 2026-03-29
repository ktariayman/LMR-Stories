import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.warn('Redis connection error (cache disabled):', err.message);
});

redis.on('connect', () => {
  console.log('Redis connected');
});

export async function connectRedis() {
  try {
    await redis.connect();
  } catch {
    console.warn('Redis unavailable — running without cache');
  }
}

// Cache helpers — gracefully degrade if Redis is down
const DEFAULT_TTL = 300; // 5 minutes

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, data: unknown, ttl = DEFAULT_TTL): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch {
    // silently fail
  }
}

export async function cacheDel(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {
    // silently fail
  }
}
