export const lightColors = {
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
  border: '#E6E6E6',

  // Accents
  success: '#4d7c1b',
  successLight: '#e4f2d4',
  warning: '#F57C00',
  danger: '#D32F2F',
  attention: '#cc3a2f',

  shadow: '#000000',
};

export type AppColors = typeof lightColors;

export const darkColors: AppColors = {
  // Brand
  brandPrimary: '#00b8a9',
  brandPrimaryDark: '#00ccbc',
  brandPrimaryLight: '#007d72',
  inactive: '#3a3a3a',

  // Neutrals
  background: '#1a1a1a',
  backgroundSecondary: '#262626',
  backgroundOverlay: 'rgba(0, 0, 0, 0.7)',
  surface: '#2a2a2a',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textInactive: '#888888',
  border: '#3a3a3a',

  // Accents
  success: '#6BC926',
  successLight: '#2d4d0f',
  warning: '#FF9800',
  danger: '#F44336',
  attention: '#E53935',

  shadow: '#ffffff',
};

// Default export for backward compatibility (light mode)
export const colors = lightColors;

const _getShadow = (_colors: AppColors) => {
  const shadow = {
    shadowColor: _colors.shadow,
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
  };

  return {
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
};

export const lightThemeShadows = _getShadow(lightColors);
export type Shadows = typeof lightThemeShadows;

export const darkThemeShadows: Shadows = _getShadow(darkColors);

export const shadows = lightThemeShadows;
