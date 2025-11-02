import { API_CLIENT } from '@lib';
import { MenuCategory, MenuItem } from '@types';

export const getMenuCategories = async (restaurantId: string): Promise<MenuCategory[]> => {
  const response = await API_CLIENT.get(`/restaurants/${restaurantId}/menu-categories`);
  return response.data;
};

export const getMenuItem = async (id: string): Promise<MenuItem> => {
  const response = await API_CLIENT.get(`/menu-items/${id}`);
  return response.data;
};

export const getMenuItems = async (categoryId: string): Promise<MenuItem[]> => {
  const response = await API_CLIENT.get(`/menu-categories/${categoryId}/menu-items`);
  return response.data;
};
