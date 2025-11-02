import { API_CLIENT } from '@lib';
import { Restaurant } from '@types';

export const getRestaurant = async (restaurantId: string): Promise<Restaurant> => {
  const response = await API_CLIENT.get(`/restaurants/${restaurantId}`);
  return response.data;
};

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const response = await API_CLIENT.get('/restaurants');
  return response.data;
};
