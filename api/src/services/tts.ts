import axios from 'axios';

interface TTSParams {
  text: string;
  language: string;
}

const VOICE_MAP: Record<string, { name: string; languageCode: string }> = {
  en: { name: 'en-US-Neural2-F', languageCode: 'en-US' },
  fr: { name: 'fr-FR-Neural2-A', languageCode: 'fr-FR' },
  ar: { name: 'ar-XA-Wavenet-B', languageCode: 'ar-XA' },
};

export async function synthesizeSpeech({ text, language }: TTSParams): Promise<string> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_TTS_API_KEY not configured — skipping TTS');
  const voice = VOICE_MAP[language] || VOICE_MAP.en;

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const response = await axios.post(url, {
    input: { text },
    voice: {
      languageCode: voice.languageCode,
      name: voice.name,
      ssmlGender: 'FEMALE',
    },
    audioConfig: {
      audioEncoding: 'MP3',
      pitch: 0,
      speakingRate: 0.9, // Slightly slower for kids
    },
  });

  return response.data.audioContent; // Base64 encoded MP3
}
