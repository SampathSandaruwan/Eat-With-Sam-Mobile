import { API_CLIENT } from '@lib';
import { MenuCategory, MenuItem } from '@types';

export const getMenuCategories = async (restaurantId: string, includeItems = false): Promise<MenuCategory[]> => {
  const response = await API_CLIENT.get(`/restaurants/${restaurantId}/menu-categories`, {
    params: {
      withMenuCategoryItems: includeItems,
    },
  });
  return response.data;
};

export const getMenuItem = async (id: string): Promise<MenuItem> => {
  const response = await API_CLIENT.get(`/menu-items/${id}`);
  return response.data;
};

export const getMenuCategoryItems = async (categoryId: string): Promise<MenuItem[]> => {
  const response = await API_CLIENT.get(`/menu-categories/${categoryId}/menu-items`);
  return response.data;
};

export const getTopTenRatedMenuItems = async (): Promise<MenuItem[]> => {
  const response = await API_CLIENT.get('/menu-items', {
    params: {
      sortBy: 'averageRating',
      sortOrder: 'desc',
      limit: 10,
    },
  });
  return response.data;
};

export const getTopTenDiscountedMenuItems = async (): Promise<MenuItem[]> => {
  const response = await API_CLIENT.get('/menu-items', {
    params: {
      sortBy: 'discountPercent',
      sortOrder: 'desc',
      limit: 10,
    },
  });
  return response.data;
};
