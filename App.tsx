/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { DrawerItem, RightDrawer } from '@components';
import { useAuthStore, useCartStore } from '@store';
import { QueryClientProvider } from '@tanstack/react-query';
import { colors } from '@theme';

import { DrawerProvider, useDrawer } from './src/contexts/drawer-context';
import { queryClient } from './src/lib';
import LoginModal from './src/screens/Auth/LoginModal';
import SignupModal from './src/screens/Auth/SignupModal';
import MenuScreen from './src/screens/Menu';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <DrawerProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppContent />
          </DrawerProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { isOpen: showRightDrawer, closeDrawer } = useDrawer();
  const { user, isAuthenticated, logout, initializeAuth } = useAuthStore();
  const clearCart = useCartStore((state) => state.clearCart);
  const authUserInitialized = useRef(false);

  // Initialize auth session on app startup (only once, no early returns)
  useEffect(() => {
    if (!authUserInitialized.current) {
      authUserInitialized.current = true;
      initializeAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const closeLogin = () => setShowLogin(false);
  const closeSignup = () => setShowSignup(false);

  const handleLogout = async () => {
    await logout();
    clearCart();
    closeDrawer();
  };

  // Drawer items based on auth state
  const drawerItems: DrawerItem[] = isAuthenticated ? [
    {
      label: user?.name || 'Profile',
      icon: 'UserIcon',
      onPress: () => {
        // Navigate to profile (future implementation)
      },
    },
    {
      label: 'Orders',
      icon: 'PackageIcon',
      onPress: () => {
        // Navigate to orders (future implementation)
      },
      showDivider: true,
    },
    {
      label: 'FAQs',
      icon: 'QuestionIcon',
      onPress: () => {
        // Navigate to FAQs (future implementation)
      },
    },
    {
      label: 'Log out',
      icon: 'SignOutIcon',
      onPress: handleLogout,
      showDivider: true,
    },
  ] : [
    {
      label: 'Sign up or log in',
      icon: 'UserIcon',
      onPress: () => {
        closeDrawer();
        openLogin();
      },
    },
    {
      label: 'FAQs',
      icon: 'QuestionIcon',
      onPress: () => {
        // Navigate to FAQs (future implementation)
      },
      showDivider: true,
    },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      {/* Right Drawer - Rendered at full SafeArea height */}
      <RightDrawer
        visible={showRightDrawer}
        onClose={closeDrawer}
        items={drawerItems}
        title={isAuthenticated ? user?.name || 'Account' : 'Menu'}
      />

      {/* Login Modal */}
      <LoginModal
        visible={showLogin}
        onClose={closeLogin}
        onNavigateToSignup={() => {
          closeLogin();
          openSignup();
        }}
      />

      {/* Signup Modal */}
      <SignupModal
        visible={showSignup}
        onClose={closeSignup}
        onNavigateToLogin={() => {
          closeSignup();
          openLogin();
        }}
      />

      <MenuScreen restaurantId={148} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  gestureRoot: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

export default App;
