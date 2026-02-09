import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { iconHash } from '../constants/iconHash';
import type { IProductCardProps } from '../types';

const AddIcon = iconHash.add;
const ShoppingCartIcon = iconHash.shoppingCart;

export const ProductCard: React.FC<IProductCardProps> = ({
  product,
  onAddToCart,
  isInCart = false,
  quantity = 0,
  isAtStockLimit = false,
}) => {
  const theme = useTheme();

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card
      sx={{
        maxWidth: 220,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderColor: 'divider',
        backgroundColor: theme.palette.background.paper,
        '& .MuiTypography-root': {
          fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
        },
        transition: 'transform 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          borderColor: theme.palette.text.primary,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid',
          borderColor: 'divider',
          aspectRatio: '4 / 3',
          backgroundColor: theme.palette.grey[100],
        }}
      >
        <CardMedia
          component='img'
          image={product.image}
          alt={product.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
            '&:hover': {
              transform: 'scale(1.04)',
            },
          }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          gap: 1.5,
        }}
      >
        <Stack spacing={0.75}>
          {product.category && (
            <Typography
              variant='overline'
              sx={{
                letterSpacing: '0.18em',
                color: 'text.secondary',
                fontWeight: 600,
              }}
            >
              {product.category}
            </Typography>
          )}
          <Typography
            variant='h6'
            component='h2'
            sx={{
              fontWeight: 500,
              fontSize: '1.05rem',
              color: theme.palette.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>
        </Stack>

        {product.description && (
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}
          >
            {product.description}
          </Typography>
        )}

        {product.stock !== undefined && (
          <Typography
            variant='caption'
            sx={{
              color:
                product.stock === 0
                  ? theme.palette.error.main
                  : product.stock <= 5
                    ? theme.palette.warning.main
                    : theme.palette.text.secondary,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            {product.stock === 0
              ? 'Out of stock'
              : product.stock <= 5
                ? `Low stock · ${product.stock} left`
                : 'In stock'}
          </Typography>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Stack direction='row' spacing={1} alignItems='center'>
            {product.discountPrice ? (
              <>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '1.1rem',
                  }}
                >
                  {formatPrice(product.discountPrice)}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    textDecoration: 'line-through',
                    color: theme.palette.text.secondary,
                    fontSize: '0.85rem',
                  }}
                >
                  {formatPrice(product.price)}
                </Typography>
                <Chip
                  label={`${Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off`}
                  size='small'
                  sx={{
                    backgroundColor: 'transparent',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    height: 20,
                  }}
                />
              </>
            ) : (
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: '1.1rem',
                }}
              >
                {formatPrice(product.price)}
              </Typography>
            )}
          </Stack>
        </Box>

        <Stack direction='row' spacing={1} alignItems='center'>
          <Button
            variant='contained'
            fullWidth
            disableElevation
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAtStockLimit}
            startIcon={isInCart ? <ShoppingCartIcon /> : <AddIcon />}
            sx={{
              borderRadius: 0,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              py: 1.1,
              fontSize: '0.75rem',
              fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
              '&:hover': {
                opacity: 0.92,
              },
              '&:disabled': {
                background: theme.palette.action.disabledBackground,
                color: theme.palette.text.disabled,
              },
              transition: 'all 0.2s ease',
            }}
          >
            {product.stock === 0
              ? 'Out of Stock'
              : isAtStockLimit
                ? 'Stock Limit Reached'
                : isInCart
                  ? `Add More${quantity > 0 ? ` (${quantity})` : ''}`
                  : 'Add to Cart'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
