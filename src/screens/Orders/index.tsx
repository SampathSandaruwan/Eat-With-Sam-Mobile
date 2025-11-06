import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { CommonActions,useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icon, Text, TopNavBar } from '@components';
import { useOrders } from '@hooks';
import { useAuthStore } from '@store';
import { TOP_NAV_HEIGHT, useColors } from '@theme';
import { Order } from '@types';

import OrderCard from './dections/OrderCard';

import { RootStackParams } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

export default function OrdersScreen() {
  const colors = useColors();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id);
  const navigation = useNavigation<NavigationProp>();

  // Redirect to Restaurants if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Restaurants' }],
        }),
      );
    }
  }, [isAuthenticated, navigation]);

  const { data: ordersData, isLoading, refetch, isRefetching } = useOrders(userId ?? 0);

  // Don't render if not authenticated
  if (!isAuthenticated || !userId) {
    return null;
  }

  const handleOrderPress = () => {
    // Navigate to order details (future implementation)
    // navigation.navigate('OrderDetails', { orderId: order.id });
  };

  const renderOrder: ListRenderItem<Order> = ({ item }) => (
    <OrderCard order={item} onPress={handleOrderPress} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="Package" size={64} color={colors.textSecondary} />
      <Text size="heading2" weight="bold" style={styles.emptyText}>
        No orders yet
      </Text>
      <Text color="secondary" style={styles.emptySubtext}>
        Your order history will appear here
      </Text>
    </View>
  );

  // Orders are already sorted by backend (most recent first by default)
  // No need for client-side sorting

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <TopNavBar />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      ) : (
        <FlatList
          data={ordersData?.orders ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={[
            styles.listContent,
            ordersData?.orders?.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.brandPrimary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    marginBottom: 8,
    marginTop: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: TOP_NAV_HEIGHT + 16,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: TOP_NAV_HEIGHT,
  },
});

