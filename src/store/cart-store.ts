import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage,persist } from 'zustand/middleware';

import { CartItem, CartSummary } from '@types';

interface CartState {
  items: CartItem[];
  addItem: (dish: CartItem['dish'], quantity?: number) => void;
  removeItem: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  clearCart: () => void;
  getCartSummary: (deliveryFee?: number, taxRate?: number, serviceFeePercentage?: number) => CartSummary;
  getItemQuantity: (dishId: number) => number;
  getTotalItems: () => number;
}

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    const itemPrice = item.dish.price * (1 - (item.dish.discountPercent ?? 0) / 100);
    return sum + itemPrice * item.quantity;
  }, 0);
};

const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * taxRate;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (dish, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.dish.id === dish.id,
          );

          if (existingItemIndex >= 0) {
            // Item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            };
            return { items: updatedItems };
          }

          // New item, add to cart
          return {
            items: [...state.items, { dish, quantity }],
          };
        });
      },

      removeItem: (dishId) => {
        set((state) => ({
          items: state.items.filter((item) => item.dish.id !== dishId),
        }));
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.dish.id === dishId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartSummary: (deliveryFee = 0, taxRate = 0, serviceFeePercentage = 0) => {
        const subtotal = calculateSubtotal(get().items);
        const serviceFee = subtotal * serviceFeePercentage;
        const tax = calculateTax(subtotal, taxRate);
        const total = subtotal + deliveryFee + serviceFee + tax;

        return {
          subtotal,
          deliveryFee,
          serviceFee,
          tax,
          total,
        };
      },

      getItemQuantity: (dishId) => {
        const item = get().items.find((cartItem) => cartItem.dish.id === dishId);
        return item?.quantity ?? 0;
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

