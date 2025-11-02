import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage,persist } from 'zustand/middleware';

import { CartItem, CartSummary } from '@types';

interface CartState {
  items: CartItem[];
  addItem: (menuItem: CartItem['menuItem'], quantity?: number) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  getCartSummary: (deliveryFee?: number, taxRate?: number) => CartSummary;
  getItemQuantity: (menuItemId: number) => number;
  getTotalItems: () => number;
}

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    const itemPrice = item.menuItem.price * (1 - (item.menuItem.discountPercent ?? 0) / 100);
    return sum + itemPrice * item.quantity;
  }, 0);
};

const calculateTax = (subtotal: number, taxRate = 0.2): number => {
  return subtotal * taxRate;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.menuItem.id === menuItem.id,
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
            items: [...state.items, { menuItem, quantity }],
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItem.id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartSummary: (deliveryFee = 0, taxRate = 0.2) => {
        const subtotal = calculateSubtotal(get().items);
        const tax = calculateTax(subtotal, taxRate);
        const total = subtotal + deliveryFee + tax;

        return {
          subtotal,
          deliveryFee,
          tax,
          total,
        };
      },

      getItemQuantity: (menuItemId) => {
        const item = get().items.find((cartItem) => cartItem.menuItem.id === menuItemId);
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

