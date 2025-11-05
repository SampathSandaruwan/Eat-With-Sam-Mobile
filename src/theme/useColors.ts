import { useMemo } from 'react';

import { useThemeStore } from '@store';

import {
  type AppColors,
  darkColors,
  darkThemeShadows,
  lightColors,
  lightThemeShadows,
  type Shadows } from './colors';

export function useColors(): AppColors {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return useMemo(() => {
    return isDarkMode ? darkColors : lightColors;
  }, [isDarkMode]);
}

export function useShadows(): Shadows {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return useMemo(() => {
    return isDarkMode ? darkThemeShadows : lightThemeShadows;
  }, [isDarkMode]);
}
