import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
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
        maxWidth: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
        },
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Product Image with Zoom Effect */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: 200,
          borderRadius: 0,
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
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        />

        {/* Stock Status Indicator */}
        {product.stock !== undefined && product.stock <= 5 && (
          <Chip
            label={
              product.stock === 0
                ? 'Out of Stock'
                : `Low Stock: ${product.stock}`
            }
            size='small'
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor:
                product.stock === 0
                  ? theme.palette.error.main
                  : theme.palette.warning.main,
              color: theme.palette.primary.contrastText,
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          />
        )}

        {/* Category Badge */}
        {product.category && (
          <Chip
            label={product.category}
            size='small'
            variant='outlined'
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        {/* Product Name */}
        <Typography
          variant='h6'
          component='h2'
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            mb: 1,
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

        {/* Product Description (if available) */}
        {product.description && (
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: '0.85rem',
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Price Section */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            {product.discountPrice ? (
              <>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontSize: '1.2rem',
                  }}
                >
                  {formatPrice(product.discountPrice)}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    textDecoration: 'line-through',
                    color: theme.palette.text.secondary,
                    fontSize: '0.9rem',
                  }}
                >
                  {formatPrice(product.price)}
                </Typography>
                <Chip
                  label={`${Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF`}
                  size='small'
                  sx={{
                    backgroundColor: theme.palette.success.main,
                    color: theme.palette.primary.contrastText,
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
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  fontSize: '1.2rem',
                }}
              >
                {formatPrice(product.price)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant='contained'
          fullWidth
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          startIcon={isInCart ? <ShoppingCartIcon /> : <AddIcon />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: 0,
            fontWeight: 600,
            textTransform: 'none',
            py: 1.5,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            '&:disabled': {
              backgroundColor: theme.palette.grey[400],
              color: theme.palette.grey[600],
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isInCart
            ? `Add More${quantity > 0 ? ` (${quantity})` : ''}`
            : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
};
