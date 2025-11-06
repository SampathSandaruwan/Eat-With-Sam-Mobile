import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Icon, PhosphorIconName, Text } from '@components';
import { useColors, useShadows } from '@theme';
import { Order, OrderStatus } from '@types';
import { formatCurrency, formatDate } from '@utils';

type OrderCardProps = {
    order: Order;
    onPress: (order: Order) => void;
};


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

const getStatusIcon = (status: OrderStatus): PhosphorIconName => {
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

export  default function OrderCard({ order, onPress }: OrderCardProps) {
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
            <Icon name={statusIcon} size={16} color={statusColor} />
            <Text size="small" weight="medium" style={{ color: statusColor }}>
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

      <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
        <Text size="body" color="secondary">
          {formatDate(order.createdAt)}
        </Text>
        <Icon name="CaretRight" size={20} color={colors.brandPrimary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  statusBadge: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto',
  },
});
