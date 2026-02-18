import React from 'react';
import { Grid } from '@mui/material';
import { ProductCard } from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem } from '../store/cartSlice';
import { selectIsProductInCart, selectCartItemById } from '../store/selectors';
import type { IProduct } from '../types';
import { useAlert } from '../hooks';
import { MESSAGES } from '../constants';
import { isShiftOpen } from '../utils/drawer';

interface ProductGridItemProps {
  product: IProduct;
}

export const ProductGridItem: React.FC<ProductGridItemProps> = ({
  product,
}) => {
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();
  const isInCart = useAppSelector(state =>
    selectIsProductInCart(state, product.id)
  );
  const cartItem = useAppSelector(state =>
    selectCartItemById(state, product.id)
  );
  const currentQuantity = cartItem?.quantity || 0;
  const isAtStockLimit = product.stock
    ? currentQuantity >= product.stock
    : false;

  const handleAddToCart = (product: IProduct) => {
    if (!isShiftOpen()) {
      showAlert({
        message: MESSAGES.DRAWER.SHIFT_REQUIRED,
        severity: 'warning',
      });
      return;
    }
    dispatch(addItem(product));
    showAlert({
      message: MESSAGES.CART.ADDED(product.name),
      severity: 'success',
    });
  };

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
      <ProductCard
        product={product}
        onAddToCart={handleAddToCart}
        isInCart={isInCart}
        quantity={currentQuantity}
        isAtStockLimit={isAtStockLimit}
      />
    </Grid>
  );
};
