import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  DrawerItem,
  FloatingActionButton,
  RightDrawer,
} from '@components';
import { AuthModalProvider, CartModalProvider, DrawerProvider, useAuthModal, useCartModal, useDrawer } from '@contexts';
import { configureGoogleSignIn, queryClient } from '@lib';
import { useAuthStore, useCartStore } from '@store';
import { QueryClientProvider } from '@tanstack/react-query';

import Navigation from './navigation';
import { RootStackParams } from './navigation/types';
import LoginModal from './screens/Auth/LoginModal';
import SignupModal from './screens/Auth/SignupModal';
import CartModal from './screens/Cart';
import { useColors } from './theme';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

function AppContentInner() {
  const { showCart, openCart, closeCart } = useCartModal();
  const { showLogin, showSignup, openLogin, openSignup, closeLogin, closeSignup } = useAuthModal();
  const { isOpen: showRightDrawer, closeDrawer } = useDrawer();
  const { user, isAuthenticated, logout } = useAuthStore();
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.items);
  const colors = useColors();

  const navigation = useNavigation<NavigationProp>();

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
      label: 'Restaurants',
      icon: 'StorefrontIcon',
      onPress: () => {
        closeDrawer();
        navigation.navigate('Restaurants');
      },
      showDivider: true,
    },
    {
      label: 'Orders',
      icon: 'PackageIcon',
      onPress: () => {
        closeDrawer();
        if (isAuthenticated) {
          navigation.navigate('Orders');
        } else {
          openLogin();
        }
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Navigation Stack */}
      <Navigation />

      {/* Shared UI Components */}
      {/* Right Drawer - Rendered at full SafeArea height */}
      <RightDrawer
        visible={showRightDrawer}
        onClose={closeDrawer}
        items={drawerItems}
        isAuthenticated={isAuthenticated}
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
        <View
          style={[
            styles.cartButtonContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
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
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

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
    borderTopWidth: 1,
    justifyContent: 'center',
    padding: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  container: {
    flex: 1,
  },
});
