import { useQuery } from '@tanstack/react-query';

import { getMenuCategories } from '../services';

export const useMenuCategories = (restaurantId: number | null) => {
  return useQuery({
    queryKey: ['menu-categories', restaurantId],
    queryFn: () => {
      if (restaurantId === null) {
        throw new Error('Menu item ID is required');
      }
      return getMenuCategories(restaurantId.toString());
    },
    enabled: restaurantId !== null,
  });
};

