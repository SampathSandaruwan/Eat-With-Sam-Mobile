import { MenuItem } from './menu.types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

