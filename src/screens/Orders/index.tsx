import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Icon, PhosphorIconName, Text, TopNavBar } from '@components';
import { useOrders } from '@hooks';
import { useAuthStore } from '@store';
import { TOP_NAV_HEIGHT, useColors, useShadows } from '@theme';
import { Order, OrderStatus } from '@types';
import { formatCurrency, formatDate } from '@utils';

const getStatusColor = (status: OrderStatus, colors: ReturnType<typeof useColors>): string => {
  switch (status) {
    case 'pending':
    case 'confirmed':
      return colors.attention;
    case 'preparing':
    case 'ready':
      return colors.warning;
    case 'out_for_delivery':
      return colors.brandPrimary;
    case 'delivered':
      return colors.success;
    case 'cancelled':
      return colors.danger;
    default:
      return colors.textSecondary;
  }
};

const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'out_for_delivery':
      return 'Out for delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const getStatusIcon = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
    case 'confirmed':
      return 'Clock';
    case 'preparing':
    case 'ready':
      return 'Timer';
    case 'out_for_delivery':
      return 'Bicycle';
    case 'delivered':
      return 'CheckCircle';
    case 'cancelled':
      return 'XCircle';
    default:
      return 'Package';
  }
};

type OrderCardProps = {
  order: Order;
  onPress: (order: Order) => void;
};

function OrderCard({ order, onPress }: OrderCardProps) {
  const colors = useColors();
  const shadows = useShadows();

  const statusColor = getStatusColor(order.status, colors);
  const statusLabel = getStatusLabel(order.status);
  const statusIcon = getStatusIcon(order.status);

  return (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.background }, shadows.card]}
      onPress={() => onPress(order)}
      activeOpacity={0.8}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Icon name={statusIcon as PhosphorIconName} size={16} color={statusColor} />
            <Text size="small" weight="medium" style={{ color: statusColor, marginLeft: 4 }}>
              {statusLabel}
            </Text>
          </View>
          {/* Restaurant name would come from order.restaurant relation if included */}
        </View>
        <Text size="heading1" weight="bold">
          {formatCurrency(order.totalAmount)}
        </Text>
      </View>

      <View style={styles.orderDetails}>
        <Text size="small" color="secondary">
          Order #{order.orderNumber}
        </Text>
        <Text size="small" color="secondary">
          {formatDate(order.placedAt)}
        </Text>
      </View>

      <View style={styles.orderFooter}>
        <Text size="body" color="secondary">
          {formatDate(order.createdAt)}
        </Text>
        <Icon name="CaretRight" size={20} color={colors.brandPrimary} />
      </View>
    </TouchableOpacity>
  );
}

export default function OrdersScreen() {
  const colors = useColors();
  const userId = useAuthStore((state) => state.user?.id);

  const { data: ordersData, isLoading, refetch, isRefetching } = useOrders(userId ?? 0);

  const handleOrderPress = (order: Order) => {
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
  orderCard: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  orderFooter: {
    alignItems: 'center',
    borderTopColor: '#F1F1F1',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderHeaderLeft: {
    flex: 1,
    marginRight: 16,
  },
  restaurantName: {
    marginTop: 8,
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto',
  },
});

