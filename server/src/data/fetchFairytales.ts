import axios from 'axios';

export interface SeedQuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface SeedTranslation {
  language: string;
  title: string;
  content: string;
  summary: string;
}

export interface SeedStory {
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: '5-7' | '8-10';
  theme: string;
  themeEmoji: string;
  translations: SeedTranslation[];
  quiz: { language: string; questions: SeedQuizQuestion[] }[];
}

interface HFRow {
  row_idx: number;
  row: {
    story_name: string;
    story_section: string;
    answer1: string;
    answer2?: string;
    answer3?: string;
    answer4?: string;
    question: string;
    correct_answer: string;
    story_fr?: string;
  };
}

const THEME_MAP: Record<string, { theme: string; emoji: string }> = {
  'cinderella': { theme: 'kindness', emoji: '👠' },
  'little red': { theme: 'courage', emoji: '🐺' },
  'snow white': { theme: 'kindness', emoji: '🍎' },
  'beauty': { theme: 'kindness', emoji: '🌹' },
  'sleeping': { theme: 'adventure', emoji: '🌙' },
  'rapunzel': { theme: 'courage', emoji: '🌺' },
  'hansel': { theme: 'adventure', emoji: '🍬' },
  'three bears': { theme: 'animals', emoji: '🐻' },
  'three little pigs': { theme: 'courage', emoji: '🐷' },
  'jack': { theme: 'adventure', emoji: '🌱' },
  'rumpelstiltskin': { theme: 'adventure', emoji: '✨' },
  'thumbelina': { theme: 'friendship', emoji: '🌸' },
  'ugly duckling': { theme: 'friendship', emoji: '🦢' },
  'little mermaid': { theme: 'adventure', emoji: '🧜' },
  'emperor': { theme: 'courage', emoji: '👑' },
  'frog': { theme: 'kindness', emoji: '🐸' },
  'puss': { theme: 'adventure', emoji: '🐱' },
  'ali baba': { theme: 'adventure', emoji: '🏺' },
  'aladdin': { theme: 'adventure', emoji: '🪔' },
  'pinocchio': { theme: 'kindness', emoji: '🪵' },
  'peter pan': { theme: 'adventure', emoji: '🧚' },
  'alice': { theme: 'adventure', emoji: '🐇' },
  'wizard': { theme: 'adventure', emoji: '🌈' },
  'goldilocks': { theme: 'animals', emoji: '🐻' },
  'tortoise': { theme: 'courage', emoji: '🐢' },
  'hare': { theme: 'courage', emoji: '🐇' },
  'lion': { theme: 'courage', emoji: '🦁' },
  'elephant': { theme: 'animals', emoji: '🐘' },
};

function detectTheme(name: string): { theme: string; emoji: string } {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(THEME_MAP)) {
    if (lower.includes(key)) return val;
  }
  return { theme: 'adventure', emoji: '📖' };
}

function detectDifficulty(content: string): 'easy' | 'medium' | 'hard' {
  const words = content.split(/\s+/).length;
  if (words < 300) return 'easy';
  if (words < 600) return 'medium';
  return 'hard';
}

function detectAgeGroup(difficulty: 'easy' | 'medium' | 'hard'): '5-7' | '8-10' {
  return difficulty === 'hard' ? '8-10' : '5-7';
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function buildSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  return sentences.slice(0, 2).join('. ').trim() + '.';
}

function makeQuizOptions(row: HFRow['row']): string[] {
  const opts = [row.answer1, row.answer2, row.answer3, row.answer4]
    .filter((o): o is string => !!o && o.trim().length > 0)
    .slice(0, 4);
  // Ensure exactly 3-4 options
  while (opts.length < 3) opts.push(`Option ${opts.length + 1}`);
  return opts.slice(0, 4);
}

export async function fetchFairytales(): Promise<SeedStory[]> {
  console.log('Fetching fairytales from HuggingFace...');

  const rows: HFRow[] = [];
  const pageSize = 100;

  for (let offset = 0; offset < 500; offset += pageSize) {
    try {
      const url = `https://datasets-server.huggingface.co/rows?dataset=benjleite%2FFairytaleQA-translated-french&config=default&split=train&offset=${offset}&length=${pageSize}`;
      const resp = await axios.get(url, { timeout: 15000 });
      const batch: HFRow[] = resp.data.rows || [];
      if (batch.length === 0) break;
      rows.push(...batch);
    } catch (err: any) {
      console.warn(`HuggingFace fetch page offset=${offset} failed:`, err.message);
      break;
    }
  }

  if (rows.length === 0) {
    console.warn('No data from HuggingFace — using fallback stories');
    return [];
  }

  console.log(`Fetched ${rows.length} rows from HuggingFace`);

  // Group by story_name
  const grouped = new Map<string, HFRow[]>();
  for (const r of rows) {
    const name = r.row.story_name;
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name)!.push(r);
  }

  const stories: SeedStory[] = [];

  for (const [name, storyRows] of grouped) {
    if (stories.length >= 40) break;

    const slug = toSlug(name);
    if (!slug) continue;

    // Build EN content by joining story sections
    const enContent = storyRows
      .map((r) => r.row.story_section)
      .filter(Boolean)
      .join('\n\n');

    // Build FR content
    const frContent = storyRows
      .map((r) => r.row.story_fr)
      .filter((s): s is string => !!s && s.trim().length > 0)
      .join('\n\n');

    if (enContent.length < 100) continue;

    const { theme, emoji } = detectTheme(name);
    const difficulty = detectDifficulty(enContent);
    const ageGroup = detectAgeGroup(difficulty);

    const cleanTitle = name
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const enSummary = buildSummary(enContent);
    const frSummary = frContent ? buildSummary(frContent) : enSummary;

    const translations: SeedTranslation[] = [
      { language: 'en', title: cleanTitle, content: enContent, summary: enSummary },
    ];
    if (frContent.length > 100) {
      translations.push({ language: 'fr', title: cleanTitle, content: frContent, summary: frSummary });
    }

    // Build quiz questions from QA pairs (max 3 per language)
    const enQuizRows = storyRows
      .filter((r) => r.row.question && r.row.correct_answer)
      .slice(0, 3);

    const enQuestions: SeedQuizQuestion[] = enQuizRows.map((r) => ({
      question: r.row.question,
      options: makeQuizOptions(r.row),
      correct_answer: r.row.correct_answer,
    }));

    const quiz: { language: string; questions: SeedQuizQuestion[] }[] = [];
    if (enQuestions.length > 0) quiz.push({ language: 'en', questions: enQuestions });

    stories.push({ slug, difficulty, ageGroup, theme, themeEmoji: emoji, translations, quiz });
  }

  console.log(`Built ${stories.length} stories from HuggingFace data`);
  return stories;
}
