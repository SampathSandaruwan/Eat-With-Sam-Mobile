import React, { useEffect } from 'react';
import { CommonActions,useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthModal } from '@contexts';
import { useAuthStore } from '@store';

import { RootStackParams } from './types';

import MenuScreen from '../screens/Menu';
import OrdersScreen from '../screens/Orders';
import RestaurantsScreen from '../screens/Restaurants';

const Stack = createNativeStackNavigator<RootStackParams>();

export default function Navigation() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { openLogin } = useAuthModal();
  const navigation = useNavigation();

  // Navigation guard: intercept unauthorized navigation to Orders
  // This handles edge cases where navigation might be attempted programmatically
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const state = e.data.state;
      if (state && state.routes) {
        const currentRoute = state.routes[state.index];

        // If on Orders screen without authentication, redirect to Restaurants
        if (currentRoute?.name === 'Orders' && !isAuthenticated) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Restaurants' }],
            }),
          );
          // Show login modal to prompt user to authenticate
          openLogin();
        }
      }
    });

    return unsubscribe;
  }, [navigation, isAuthenticated, openLogin]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
      }}
      initialRouteName="Restaurants"
    >
      <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      {isAuthenticated && (
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            // Prevent back navigation if user logs out while on Orders screen
            gestureEnabled: isAuthenticated,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

