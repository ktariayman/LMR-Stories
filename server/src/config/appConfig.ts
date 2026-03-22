export const serverConfig = {
  enableAI: !!(process.env.GROQ_API_KEY || process.env.OLLAMA_URL),
  enableCommunity: true,
  languages: ['en', 'fr', 'ar'],
  maxStoriesPerUser: 50,
  version: '2.0.0',
};
