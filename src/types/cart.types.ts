import { Dish } from './menu.types';

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  total: number;
}

