import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IProduct, ICartItem } from '../types';

interface CartState {
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<IProduct>) => {
      const product = action.payload;
      const existingItem = state.items.find(
        item => item.product.id === product.id
      );

      // Check stock limit
      const currentQuantity = existingItem?.quantity || 0;
      const maxAllowed = product.stock || Infinity;

      if (currentQuantity >= maxAllowed) {
        return; // Don't add if already at stock limit
      }

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + 1, maxAllowed);
        existingItem.quantity = newQuantity;
      } else {
        const newQuantity = Math.min(1, maxAllowed);
        state.items.push({
          product,
          quantity: newQuantity,
        });
      }

      // Recalculate totals
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) =>
          sum +
          (item.product.discountPrice || item.product.price) * item.quantity,
        0
      );
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);

      // Recalculate totals
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) =>
          sum +
          (item.product.discountPrice || item.product.price) * item.quantity,
        0
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);

      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter(
            item => item.product.id !== productId
          );
        } else {
          // Respect stock limit
          const maxAllowed = item.product.stock || Infinity;
          item.quantity = Math.min(quantity, maxAllowed);
        }

        // Recalculate totals
        state.totalItems = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.totalPrice = state.items.reduce(
          (sum, item) =>
            sum +
            (item.product.discountPrice || item.product.price) * item.quantity,
          0
        );
      }
    },

    clearCart: state => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    updateItemNotes: (
      state,
      action: PayloadAction<{ productId: string; notes: string }>
    ) => {
      const { productId, notes } = action.payload;
      const item = state.items.find(item => item.product.id === productId);

      if (item) {
        item.notes = notes;
      }
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  updateItemNotes,
} = cartSlice.actions;

export default cartSlice.reducer;
