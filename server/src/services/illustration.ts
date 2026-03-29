import { logger } from '../config/logger';

/**
 * Generate a cover illustration URL for a story.
 *
 * Uses Pollinations.ai — a free, no-API-key image generation service.
 * The URL itself IS the image (on-demand generation via URL params).
 * Images are cached on their CDN after first request.
 */
export function generateCoverUrl(params: {
  title: string;
  theme: string;
  themeEmoji: string;
  ageGroup: string;
}): string {
  const { title, theme, themeEmoji } = params;

  const prompt = [
    `Children's storybook illustration for "${title}",`,
    `theme: ${theme} ${themeEmoji},`,
    'colorful, warm, friendly, watercolor style,',
    'no text, no words, no letters,',
    'safe for children, whimsical, soft lighting',
  ].join(' ');

  const encoded = encodeURIComponent(prompt);
  const seed = hashCode(title);

  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&seed=${seed}&nologo=true`;
}

/**
 * Simple deterministic hash so the same title always produces the same image.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Generate cover images for multiple stories (used during seeding).
 * Returns a map of slug → cover URL.
 */
export function generateCoversForStories(
  stories: { slug: string; title: string; theme: string; themeEmoji: string; ageGroup: string }[],
): Map<string, string> {
  const covers = new Map<string, string>();
  for (const s of stories) {
    try {
      covers.set(s.slug, generateCoverUrl(s));
    } catch (err) {
      logger.warn({ slug: s.slug, err }, 'Failed to generate cover URL');
    }
  }
  return covers;
}
