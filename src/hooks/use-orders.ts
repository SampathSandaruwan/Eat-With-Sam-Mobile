import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getOrder, getOrders, placeOrder, updateOrderStatus as updateOrderStatusService } from '../services';
import {
  PlaceOrderRequestBody,
  UpdateOrderStatusRequestBody,
} from '../types';

export const useOrders = (userId: number) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getOrders(userId),
    enabled: userId > 0, // Only fetch if userId is valid
    select: (response) => ({
      orders: response.data,
      pagination: response.pagination,
    }),
  });
};

export const useOrder = (orderId: number | null) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => {
      if (orderId === null) {
        throw new Error('Order ID is required');
      }
      return getOrder(orderId);
    },
    enabled: orderId !== null,
    select: (response) => response.data,
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: PlaceOrderRequestBody) => placeOrder(orderData),
    onSuccess: (response) => {
      // Invalidate all orders queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Optionally cache the new order
      if (response.data) {
        queryClient.setQueryData(['order', response.data.id], response);
      }
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      statusData,
    }: {
      orderId: number;
      statusData: UpdateOrderStatusRequestBody;
    }) => updateOrderStatusService(orderId, statusData),
    onSuccess: (response, variables) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Update the specific order in cache
      if (response.data) {
        queryClient.setQueryData(['order', variables.orderId], response);
      }
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => {
      return updateOrderStatusService(orderId, { status: 'cancelled' });
    },
    onSuccess: (response, orderId) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Update the specific order in cache
      if (response.data) {
        queryClient.setQueryData(['order', orderId], response);
      }
    },
  });
};

