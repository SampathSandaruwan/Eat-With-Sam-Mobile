import { API_CLIENT } from '@lib';
import { ApiResponse, PaginatedApiResponse, Restaurant } from '@types';

export const getRestaurant = async (restaurantId: string): Promise<ApiResponse<Restaurant>> => {
  const response = await API_CLIENT.get(`/restaurants/${restaurantId}`);
  return response.data;
};

export const getRestaurants = async (): Promise<PaginatedApiResponse<Restaurant>> => {
  const response = await API_CLIENT.get('/restaurants');
  return response.data;
};
