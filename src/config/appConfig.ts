export const appConfig = {
  // Feature flags — set to false to hide tabs/features
  enableAI: true,
  enableCommunity: true,
  requireAuth: true, // If false, guest access allowed

  // Supported languages
  languages: ['en', 'fr', 'ar'] as const,
  defaultLanguage: 'en' as const,

  // API base URL — override with EXPO_PUBLIC_API_URL env var
  apiBaseUrl: (process.env.EXPO_PUBLIC_API_URL as string) || 'http://localhost:3001',
} as const;

export type AppLanguage = typeof appConfig.languages[number];
