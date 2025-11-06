import { API_CLIENT } from '@lib';
import {
  ApiResponse,
  Order,
  PaginatedApiResponse,
  PlaceOrderRequestBody,
  UpdateOrderStatusRequestBody,
} from '@types';

export const getOrders = async (userId: number): Promise<PaginatedApiResponse<Order>> => {
  const response = await API_CLIENT.get<PaginatedApiResponse<Order>>(`/users/${userId}/orders`);
  return response.data;
};

export const getOrder = async (orderId: number): Promise<ApiResponse<Order>> => {
  const response = await API_CLIENT.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data;
};

export const placeOrder = async (
  orderData: PlaceOrderRequestBody,
): Promise<ApiResponse<Order>> => {
  const response = await API_CLIENT.post<ApiResponse<Order>>('/orders', orderData);
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  statusData: UpdateOrderStatusRequestBody,
): Promise<ApiResponse<Order>> => {
  const response = await API_CLIENT.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, statusData);
  return response.data;
};

