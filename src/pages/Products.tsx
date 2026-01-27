import { Typography, Box, Grid } from '@mui/material';
import { ProductCard } from '../components';
import { useAppDispatch } from '../store/hooks';
import { addItem } from '../store/cartSlice';
import type { IProduct } from '../types';

// Sample product data for demonstration
const sampleProducts: IProduct[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    discountPrice: 69.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Electronics',
    stock: 15,
    description:
      'High-quality wireless headphones with noise cancellation and premium sound.',
    sku: 'WH-001',
  },
  {
    id: '2',
    name: 'Organic Coffee Beans',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    category: 'Food & Beverage',
    stock: 8,
    description: 'Premium organic coffee beans sourced from sustainable farms.',
    sku: 'CF-002',
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199.99,
    discountPrice: 149.99,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Electronics',
    stock: 0,
    description:
      'Advanced fitness tracking with heart rate monitoring and GPS.',
    sku: 'FW-003',
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    category: 'Furniture',
    stock: 3,
    description: 'Comfortable ergonomic chair designed for long work sessions.',
    sku: 'OC-004',
  },
];

export const Products = () => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: IProduct) => {
    dispatch(addItem(product));
  };

  return (
    <Box>
      <Typography variant='h4' component='h1' gutterBottom>
        Products
      </Typography>
      <Typography variant='body1' sx={{ mb: 4, color: 'text.secondary' }}>
        Browse our collection of products. Click "Add to Cart" to add items to
        your order.
      </Typography>

      <Grid container spacing={3}>
        {sampleProducts.map(product => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              isInCart={false} // Will be updated with real cart state later
              quantity={0} // Will be updated with real cart state later
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
