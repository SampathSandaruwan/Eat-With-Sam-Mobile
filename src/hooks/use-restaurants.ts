import { useQuery } from '@tanstack/react-query';

import { getRestaurant, getRestaurants } from '../services';

export const useRestaurant = (restaurantId: number | null) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => {
      if (restaurantId === null) {
        throw new Error('Restaurant ID is required');
      }
      return getRestaurant(restaurantId.toString());
    },
    enabled: restaurantId !== null,
  });
};

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: () => {
      return getRestaurants();
    },
  });
};

