import { useQuery } from '@tanstack/react-query';

import { getMenuCategoryItems,getMenuItem, getTopTenDiscountedMenuItems, getTopTenRatedMenuItems } from '../services';

export const useMenuItem = (menuItemId: number | null) => {
  return useQuery({
    queryKey: ['menu-item', menuItemId],
    queryFn: () => {
      if (menuItemId === null) {
        throw new Error('Menu item ID is required');
      }
      return getMenuItem(menuItemId.toString());
    },
    enabled: menuItemId !== null,
  });
};

export const useMenuCategoryItems = (categoryId: number | null) => {
  return useQuery({
    queryKey: ['menu-category-items', categoryId],
    queryFn: () => {
      if (categoryId === null) {
        throw new Error('Category ID is required');
      }
      return getMenuCategoryItems(categoryId.toString());
    },
    enabled: categoryId !== null,
  });
};

export const useTopTenRatedMenuItems = () => {
  return useQuery({
    queryKey: ['top-ten-rated-menu-items'],
    queryFn: () => {
      return getTopTenRatedMenuItems();
    },
  });
};

export const useTopTenDiscountedMenuItems = () => {
  return useQuery({
    queryKey: ['top-ten-discounted-menu-items'],
    queryFn: () => {
      return getTopTenDiscountedMenuItems();
    },
  });
};
