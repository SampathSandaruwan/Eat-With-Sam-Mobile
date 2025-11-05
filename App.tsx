/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useMemo } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

import AppContent from './src/AppContent';
import { useThemeStore } from './src/store';
import { useColors } from './src/theme';

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = useColors();

  const navigationTheme = useMemo(() => {
    const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.brandPrimary,
        background: colors.background,
        card: colors.background,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.brandPrimary,
      },
    };
  }, [isDarkMode, colors]);

  const styles = useMemo(() => StyleSheet.create({
    mainContainer: {
      backgroundColor: colors.background,
      flex: 1,
    },
  }), [colors]);

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background}
            translucent={Platform.OS === 'android'}
          />
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


export default App;
