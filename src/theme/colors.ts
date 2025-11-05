export const colors = {
  // Brand
  brandPrimary: '#00b8a9',
  brandPrimaryDark: '#007d72',
  brandPrimaryLight: '#00ccbc',
  inactive: '#D9D9D9',

  // Neutrals
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFA',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  surface: '#FFFAE6',
  textPrimary: '#2e3333',
  textSecondary: '#585c5c',
  textInactive: '#808080',
  border: '#F1F1F1',

  // Accents
  success: '#4d7c1b',
  successLight: '#e4f2d4',
  warning: '#F57C00',
  danger: '#D32F2F',
  attention: '#cc3a2f',

  shadow: '#000000',
};

export type AppColors = typeof colors;

const shadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.09,
  shadowRadius: 4,
  elevation: 2,
};

export const shadows = {
  card: {
    ...shadow,
    shadowOffset: { width: 0, height: 2 },
  },
  roundedCard: {
    ...shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  cardWithoutTopShadow: {
    ...shadow,
    shadowOffset: { width: 0, height: 4 },
  },
  cardWithoutBottomShadow: {
    ...shadow,
    shadowOffset: { width: 0, height: -1 },
  },
  cardWithoutRightShadow: {
    ...shadow,
    shadowOffset: { width: -2, height: 0 },
  },
};

