import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DrawerItem,
  FloatingActionButton,
  RightDrawer,
} from '@components';
import { AuthModalProvider, CartModalProvider, DrawerProvider, useAuthModal, useCartModal, useDrawer } from '@contexts';
import { queryClient } from '@lib';
import { useAuthStore, useCartStore } from '@store';
import { QueryClientProvider } from '@tanstack/react-query';

import Navigation from './navigation';
import LoginModal from './screens/Auth/LoginModal';
import SignupModal from './screens/Auth/SignupModal';
import CartModal from './screens/Cart';
import { colors } from './theme/colors';

function AppContentInner() {
  const { showCart, openCart, closeCart } = useCartModal();
  const { showLogin, showSignup, openLogin, openSignup, closeLogin, closeSignup } = useAuthModal();
  const { isOpen: showRightDrawer, closeDrawer } = useDrawer();
  const { user, isAuthenticated, logout } = useAuthStore();
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    if (cartItems.length === 0) {
      setTimeout(() => {
        closeCart();
      }, 800);
    }
  }, [cartItems, closeCart]);

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
    <SafeAreaView style={styles.container}>
      {/* Navigation Stack */}
      <Navigation />

      {/* Shared UI Components */}
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

      {/* View Basket Button */}
      {cartItems.length > 0 && (
        <View style={styles.cartButtonContainer}>
          <FloatingActionButton onPress={openCart} />
        </View>
      )}

      <CartModal
        visible={showCart}
        onClose={closeCart}
      />
    </SafeAreaView>
  );
}

export default function AppContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthModalProvider>
        <CartModalProvider>
          <DrawerProvider>
            <AppContentInner />
          </DrawerProvider>
        </CartModalProvider>
      </AuthModalProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  cartButtonContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 80,
    justifyContent: 'center',
    padding: 16,
    zIndex: 10,
  },
  container: {
    flex: 1,
  },
});

