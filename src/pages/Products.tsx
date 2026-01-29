import { Typography, Box, Grid, Stack, TextField } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ProductGridItem } from '../components';
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
  return (
    <Box
      sx={{
        minHeight: '100%',
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 4, md: 6 },
        background: theme =>
          `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.12
          )} 0%, ${alpha(theme.palette.info.main, 0)} 45%)`,
      }}
    >
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Stack spacing={2} sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            variant='overline'
            sx={{
              letterSpacing: '0.22em',
              color: 'text.secondary',
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            Products
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: 'text.secondary', textAlign: 'left' }}
          >
            {sampleProducts.length} items available
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            mb: { xs: 3, md: 4 },
          }}
        >
          <TextField
            placeholder='Search products'
            variant='outlined'
            fullWidth
            size='small'
            sx={{
              maxWidth: 640,
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme =>
                  alpha(theme.palette.background.paper, 0.9),
              },
            }}
          />
        </Box>

        <Grid container spacing={1} justifyContent='flex-start'>
          {sampleProducts.map(product => (
            <ProductGridItem key={product.id} product={product} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
