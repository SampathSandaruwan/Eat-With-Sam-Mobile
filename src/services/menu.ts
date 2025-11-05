import { API_CLIENT } from '@lib';
import { ApiResponse, Dish, MenuCategory, PaginatedApiResponse } from '@types';

export const getMenuCategories = async (restaurantId: string, includeDishes = false): Promise<PaginatedApiResponse<MenuCategory>> => {
  const response = await API_CLIENT.get(`/restaurants/${restaurantId}/menu-categories`, {
    params: {
      withDishes: includeDishes,
    },
  });
  return response.data;
};

export const getDish = async (id: string): Promise<ApiResponse<Dish>> => {
  const response = await API_CLIENT.get(`/dishes/${id}`);
  return response.data;
};

export const getMenuCategoryDishes = async (categoryId: string): Promise<PaginatedApiResponse<Dish>> => {
  const response = await API_CLIENT.get(`/menu-categories/${categoryId}/dishes`);
  return response.data;
};

export const getTopTenRatedDishes = async (): Promise<PaginatedApiResponse<Dish>> => {
  const response = await API_CLIENT.get('/dishes', {
    params: {
      sortBy: 'averageRating',
      sortOrder: 'desc',
      limit: 10,
    },
  });
  return response.data;
};

export const getTopTenDiscountedDishes = async (): Promise<PaginatedApiResponse<Dish>> => {
  const response = await API_CLIENT.get('/dishes', {
    params: {
      sortBy: 'discountPercent',
      sortOrder: 'desc',
      limit: 10,
    },
  });
  return response.data;
};
