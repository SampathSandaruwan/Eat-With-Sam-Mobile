import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParams } from './types';

import MenuScreen from '../screens/Menu';
import OrdersScreen from '../screens/Orders';
import RestaurantsScreen from '../screens/Restaurants';

const Stack = createNativeStackNavigator<RootStackParams>();

export default function Navigation() {
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
      <Stack.Screen name="Orders" component={OrdersScreen} />
    </Stack.Navigator>
  );
}

