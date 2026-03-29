import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Set JWT_SECRET before importing auth service
process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long!!';

import { hashPassword, verifyPassword, signToken, verifyToken } from '../services/auth';

describe('auth service', () => {
  describe('hashPassword', () => {
    it('should return a bcrypt hash', async () => {
      const hash = await hashPassword('mypassword');
      expect(hash).not.toBe('mypassword');
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
    });

    it('should produce different hashes for same input', async () => {
      const hash1 = await hashPassword('mypassword');
      const hash2 = await hashPassword('mypassword');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const hash = await hashPassword('correctpassword');
      const result = await verifyPassword('correctpassword', hash);
      expect(result).toBe(true);
    });

    it('should return false for wrong password', async () => {
      const hash = await hashPassword('correctpassword');
      const result = await verifyPassword('wrongpassword', hash);
      expect(result).toBe(false);
    });
  });

  describe('signToken / verifyToken', () => {
    const payload = { userId: 'abc-123', username: 'testuser' };

    it('should sign and verify a token', () => {
      const token = signToken(payload);
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
    });

    it('should reject a tampered token', () => {
      const token = signToken(payload);
      const tampered = token.slice(0, -5) + 'XXXXX';
      expect(() => verifyToken(tampered)).toThrow();
    });

    it('should reject a token signed with different secret', () => {
      const fakeToken = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });
      expect(() => verifyToken(fakeToken)).toThrow();
    });

    it('should include expiration in token', () => {
      const token = signToken(payload);
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      expect(decoded.exp).toBeDefined();
    });
  });
});
