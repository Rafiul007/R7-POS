import React from 'react';
import { Grid } from '@mui/material';
import { ProductCard } from '../components';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem } from '../store/cartSlice';
import { selectIsProductInCart, selectCartItemById } from '../store/selectors';
import type { IProduct } from '../types';

interface ProductGridItemProps {
  product: IProduct;
}

export const ProductGridItem: React.FC<ProductGridItemProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector(state => selectIsProductInCart(state, product.id));
  const cartItem = useAppSelector(state => selectCartItemById(state, product.id));
  const currentQuantity = cartItem?.quantity || 0;
  const isAtStockLimit = product.stock ? currentQuantity >= product.stock : false;

  const handleAddToCart = (product: IProduct) => {
    dispatch(addItem(product));
  };

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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