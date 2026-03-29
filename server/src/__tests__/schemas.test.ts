import {
  registerSchema,
  loginSchema,
  generateStorySchema,
  translateSchema,
  quizSubmitSchema,
  createStorySchema,
} from '../middleware/schemas';

describe('Zod validation schemas', () => {
  describe('registerSchema', () => {
    it('should accept valid registration', () => {
      const result = registerSchema.safeParse({
        username: 'testuser',
        password: 'password123',
        display_name: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short username', () => {
      const result = registerSchema.safeParse({
        username: 'ab',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject username with special chars', () => {
      const result = registerSchema.safeParse({
        username: 'test@user!',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password (< 8 chars)', () => {
      const result = registerSchema.safeParse({
        username: 'testuser',
        password: '1234567',
      });
      expect(result.success).toBe(false);
    });

    it('should allow optional display_name', () => {
      const result = registerSchema.safeParse({
        username: 'testuser',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login', () => {
      const result = loginSchema.safeParse({
        username: 'testuser',
        password: 'pass',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty username', () => {
      const result = loginSchema.safeParse({
        username: '',
        password: 'pass',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        username: 'user',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('generateStorySchema', () => {
    it('should accept valid generation params', () => {
      const result = generateStorySchema.safeParse({
        theme: 'adventure',
        difficulty: 'easy',
        age_group: '5-7',
        language: 'en',
      });
      expect(result.success).toBe(true);
    });

    it('should apply defaults for missing fields', () => {
      const result = generateStorySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.theme).toBe('adventure');
        expect(result.data.difficulty).toBe('easy');
        expect(result.data.language).toBe('en');
      }
    });

    it('should reject invalid difficulty', () => {
      const result = generateStorySchema.safeParse({
        difficulty: 'impossible',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid language', () => {
      const result = generateStorySchema.safeParse({
        language: 'de',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('translateSchema', () => {
    it('should accept valid UUID and language', () => {
      const result = translateSchema.safeParse({
        story_id: '550e8400-e29b-41d4-a716-446655440000',
        target_language: 'fr',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = translateSchema.safeParse({
        story_id: 'not-a-uuid',
        target_language: 'fr',
      });
      expect(result.success).toBe(false);
    });

    it('should reject unsupported language', () => {
      const result = translateSchema.safeParse({
        story_id: '550e8400-e29b-41d4-a716-446655440000',
        target_language: 'de',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('quizSubmitSchema', () => {
    it('should accept valid answers', () => {
      const result = quizSubmitSchema.safeParse({
        answers: [0, 1, 2],
        language: 'en',
      });
      expect(result.success).toBe(true);
    });

    it('should reject answer indices out of range', () => {
      const result = quizSubmitSchema.safeParse({
        answers: [0, 5],
        language: 'en',
      });
      expect(result.success).toBe(false);
    });

    it('should default language to en', () => {
      const result = quizSubmitSchema.safeParse({
        answers: [0, 1],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.language).toBe('en');
      }
    });
  });

  describe('createStorySchema', () => {
    it('should accept valid story creation', () => {
      const result = createStorySchema.safeParse({
        difficulty: 'easy',
        age_group: '5-7',
        theme: 'kindness',
        translations: [
          {
            language: 'en',
            title: 'A Kind Story',
            content: 'Once upon a time...',
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty translations array', () => {
      const result = createStorySchema.safeParse({
        difficulty: 'easy',
        age_group: '5-7',
        theme: 'kindness',
        translations: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const result = createStorySchema.safeParse({
        theme: 'kindness',
      });
      expect(result.success).toBe(false);
    });
  });
});
