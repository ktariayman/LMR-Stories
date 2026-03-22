import { useAppStore } from '../store/useAppStore';
import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';

const translations = { en, fr, ar } as const;
type Lang = keyof typeof translations;
type TranslationKey = keyof typeof en;

export function useTranslation() {
  const language = useAppStore((s) => s.selectedLanguage) as Lang;
  const dict: Record<string, string> = translations[language] ?? en;

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let str: string = dict[key] ?? (en as Record<string, string>)[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  }

  return { t, language };
}
