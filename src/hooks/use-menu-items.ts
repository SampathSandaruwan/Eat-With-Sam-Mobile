import { useQuery } from '@tanstack/react-query';

import { getMenuItem, getMenuItems } from '../services';

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

export const useMenuItems = (categoryId: number | null) => {
  return useQuery({
    queryKey: ['menu-items', categoryId],
    queryFn: () => {
      if (categoryId === null) {
        throw new Error('Category ID is required');
      }
      return getMenuItems(categoryId.toString());
    },
    enabled: categoryId !== null,
  });
};

