import { I18nManager, StyleSheet } from 'react-native';

export const isRTL = (lang: string): boolean => lang === 'ar';

export function getTextStyle(lang: string) {
  const rtl = isRTL(lang);
  return {
    writingDirection: rtl ? ('rtl' as const) : ('ltr' as const),
    textAlign: rtl ? ('right' as const) : ('left' as const),
  };
}

export function applyRTL(lang: string) {
  const shouldBeRTL = isRTL(lang);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.forceRTL(shouldBeRTL);
  }
}
