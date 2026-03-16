export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  hero: 32,
};

export const TextStyles = {
  heroTitle: {
    fontSize: FontSizes.hero,
    fontWeight: '800' as const,
    lineHeight: FontSizes.hero * 1.2,
  },
  screenTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700' as const,
    lineHeight: FontSizes.xxxl * 1.2,
  },
  cardTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700' as const,
    lineHeight: FontSizes.xl * 1.4,
  },
  storyBody: {
    fontSize: FontSizes.xl,
    fontWeight: '400' as const,
    lineHeight: FontSizes.xl * 1.7,
  },
  quizQuestion: {
    fontSize: FontSizes.xxl,
    fontWeight: '600' as const,
    lineHeight: FontSizes.xxl * 1.4,
  },
  button: {
    fontSize: FontSizes.lg,
    fontWeight: '700' as const,
  },
  badge: {
    fontSize: FontSizes.xs,
    fontWeight: '700' as const,
  },
};
