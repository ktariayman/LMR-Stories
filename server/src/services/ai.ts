import OpenAI from 'openai';

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

interface GeneratedStory {
  title: string;
  content: string;
  summary: string;
  theme_emoji: string;
  quiz: QuizQuestion[];
}

interface GenerateParams {
  theme: string;
  difficulty: string;
  age_group: string;
  language: string;
}

interface TranslateParams {
  title: string;
  content: string;
  summary: string;
  quiz: QuizQuestion[];
  source_language: string;
  target_language: string;
}

/**
 * Provider priority:
 *  1. Groq  (GROQ_API_KEY)  — free tier, 14 400 req/day, fast Llama 3.3
 *  2. Ollama (OLLAMA_URL)   — fully local, no key needed
 *  3. Gemini (GEMINI_API_KEY) — fallback
 */
function getClient(): { client: OpenAI; model: string } {
  if (process.env.GROQ_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: 'llama-3.3-70b-versatile',
    };
  }

  if (process.env.OLLAMA_URL) {
    return {
      client: new OpenAI({
        apiKey: 'ollama',
        baseURL: `${process.env.OLLAMA_URL}/v1`,
      }),
      model: process.env.OLLAMA_MODEL || 'llama3.2',
    };
  }

  throw new Error(
    'No AI provider configured. Set GROQ_API_KEY (free at console.groq.com) or OLLAMA_URL for local inference.'
  );
}

async function callAI(prompt: string): Promise<string> {
  const { client, model } = getClient();
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1500,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content ?? '';
}

function sanitizeJSONString(raw: string): string {
  // Only escape control characters that appear INSIDE JSON string values
  let result = '';
  let inString = false;
  let i = 0;
  while (i < raw.length) {
    const ch = raw[i];
    if (inString) {
      if (ch === '\\') {
        // pass through existing escape sequences unchanged
        result += ch + (raw[i + 1] ?? '');
        i += 2;
        continue;
      } else if (ch === '"') {
        inString = false;
        result += ch;
      } else if (ch.charCodeAt(0) < 0x20) {
        // bare control character inside a string — escape it
        if (ch === '\n') result += '\\n';
        else if (ch === '\r') result += '\\r';
        else if (ch === '\t') result += '\\t';
        // drop other control chars
      } else {
        result += ch;
      }
    } else {
      if (ch === '"') inString = true;
      result += ch;
    }
    i++;
  }
  return result;
}

function extractJSON(raw: string): GeneratedStory {
  // Strip markdown fences if present
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  // Find the outermost JSON object
  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in AI response');
  const jsonStr = sanitizeJSONString(stripped.slice(start, end + 1));
  return JSON.parse(jsonStr) as GeneratedStory;
}

export async function generateStory(params: GenerateParams): Promise<GeneratedStory> {
  const { theme, difficulty, age_group, language } = params;

  const langName: Record<string, string> = { en: 'English', fr: 'French', ar: 'Arabic', es: 'Spanish', de: 'German' };
  const lang = langName[language] || 'English';
  const wordCount = difficulty === 'easy' ? '150-200' : difficulty === 'medium' ? '200-300' : '300-400';
  const ageDesc = age_group === '5-7'
    ? 'ages 5-7 (simple words, short sentences)'
    : 'ages 8-10 (richer vocabulary, more complex plot)';

  const prompt = `Write a children's story in ${lang} about "${theme}" for ${ageDesc}.

Requirements:
- Length: ${wordCount} words
- Include a clear moral lesson
- Use age-appropriate language
- Make it engaging and fun

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "title": "story title",
  "content": "the full story text with paragraphs separated by newlines",
  "summary": "1-2 sentence moral/summary",
  "theme_emoji": "one relevant emoji",
  "quiz": [
    { "question": "question 1", "options": ["A", "B", "C"], "correct_answer": "correct option exactly matching one option" },
    { "question": "question 2", "options": ["A", "B", "C"], "correct_answer": "correct option" },
    { "question": "question 3", "options": ["A", "B", "C"], "correct_answer": "correct option" }
  ]
}`;

  const text = await callAI(prompt);
  return extractJSON(text);
}

export async function translateStory(params: TranslateParams): Promise<GeneratedStory> {
  const langNames: Record<string, string> = { en: 'English', fr: 'French', ar: 'Arabic', es: 'Spanish', de: 'German' };
  const source = langNames[params.source_language] || params.source_language;
  const target = langNames[params.target_language] || params.target_language;

  const prompt = `Translate this children's story from ${source} to ${target}.
Keep the same tone, style, and age-appropriate language. Adapt cultural references if needed.

Title: ${params.title}
Story: ${params.content}
Summary: ${params.summary}
Quiz: ${JSON.stringify(params.quiz)}

Return ONLY valid JSON (no markdown fences):
{
  "title": "translated title",
  "content": "translated story",
  "summary": "translated summary",
  "theme_emoji": "same emoji",
  "quiz": [
    { "question": "translated question", "options": ["opt1", "opt2", "opt3"], "correct_answer": "correct translated option" }
  ]
}`;

  const text = await callAI(prompt);
  return extractJSON(text);
}
