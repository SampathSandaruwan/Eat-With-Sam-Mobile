import { useQuery } from '@tanstack/react-query';

import { getMenuCategoryDishes, getDish, getTopTenDiscountedDishes, getTopTenRatedDishes } from '../services';

export const useDish = (dishId: number | null) => {
  return useQuery({
    queryKey: ['dish', dishId],
    queryFn: () => {
      if (dishId === null) {
        throw new Error('Dish ID is required');
      }
      return getDish(dishId.toString());
    },
    enabled: dishId !== null,
  });
};

export const useMenuCategoryDishes = (categoryId: number | null) => {
  return useQuery({
    queryKey: ['menu-category-dishes', categoryId],
    queryFn: () => {
      if (categoryId === null) {
        throw new Error('Category ID is required');
      }
      return getMenuCategoryDishes(categoryId.toString());
    },
    enabled: categoryId !== null,
  });
};

export const useTopTenRatedDishes = () => {
  return useQuery({
    queryKey: ['top-ten-rated-dishes'],
    queryFn: () => {
      return getTopTenRatedDishes();
    },
  });
};

export const useTopTenDiscountedDishes = () => {
  return useQuery({
    queryKey: ['top-ten-discounted-dishes'],
    queryFn: () => {
      return getTopTenDiscountedDishes();
    },
  });
};
