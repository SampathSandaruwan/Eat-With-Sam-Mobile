export const colors = {
  // Brand
  brandYellow: '#FFC107', // primary brand color (yellow)
  brandYellowDark: '#E0A800',
  brandYellowLight: '#FFDE7A',

  // Neutrals
  background: '#FFFFFF',
  surface: '#FFFAE6',
  textPrimary: '#1A1A1A',
  textSecondary: '#4D4D4D',
  border: '#E6E6E6',

  // Accents
  success: '#2E7D32',
  warning: '#F57C00',
  danger: '#D32F2F',
};

export type AppColors = typeof colors;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
};

