import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;
export const selectCartTotalPrice = (state: RootState) => state.cart.totalPrice;

export const selectCartItemById = createSelector(
  [selectCartItems, (state: RootState, productId: string) => productId],
  (items, productId) => items.find(item => item.product.id === productId)
);

export const selectIsProductInCart = createSelector(
  [selectCartItems, (state: RootState, productId: string) => productId],
  (items, productId) => items.some(item => item.product.id === productId)
);
