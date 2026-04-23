import React from 'react';
import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { LocalOfferOutlined } from '@mui/icons-material';
import { iconHash } from '../constants/iconHash';
import type { IProductCardProps } from '../types';

const AddIcon = iconHash.add;
const ShoppingCartIcon = iconHash.shoppingCart;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

const hashSeed = (seed: string) =>
  seed.split('').reduce((total, char) => total + char.charCodeAt(0), 0);

const getStockMeta = (stock?: number) => {
  if (stock === 0) {
    return {
      label: 'Out of stock',
      tone: 'error' as const,
    };
  }

  if (typeof stock === 'number' && stock <= 5) {
    return {
      label: `${stock} left`,
      tone: 'warning' as const,
    };
  }

  return {
    label: typeof stock === 'number' ? `${stock} in stock` : 'In stock',
    tone: 'success' as const,
  };
};

export const ProductCard: React.FC<IProductCardProps> = ({
  product,
  onAddToCart,
  isInCart = false,
  quantity = 0,
  isAtStockLimit = false,
}) => {
  const theme = useTheme();
  const hasDiscount =
    typeof product.discountPrice === 'number' &&
    product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100
      )
    : 0;
  const stockMeta = getStockMeta(product.stock);

  const accentColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];
  const accent =
    accentColors[hashSeed(product.id || product.name) % accentColors.length];

  const stockToneMap = {
    success: {
      bg: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.dark,
    },
    warning: {
      bg: alpha(theme.palette.warning.main, 0.14),
      color: theme.palette.warning.dark,
    },
    error: {
      bg: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.error.dark,
    },
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        transition:
          'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 4,
          backgroundColor: accent,
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: alpha(accent, 0.24),
          boxShadow: `0 18px 34px ${alpha(theme.palette.common.black, 0.08)}`,
        },
      }}
    >
      <Stack spacing={1.75} sx={{ flexGrow: 1, p: 2 }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='flex-start'
          spacing={1}
        >
          <Chip
            label={product.category || 'General'}
            size='small'
            sx={{
              bgcolor: alpha(accent, 0.1),
              color: theme.palette.text.primary,
              fontWeight: 700,
            }}
          />

          <Chip
            label={stockMeta.label}
            size='small'
            sx={{
              bgcolor: stockToneMap[stockMeta.tone].bg,
              color: stockToneMap[stockMeta.tone].color,
              fontWeight: 700,
            }}
          />
        </Stack>

        <Box
          sx={{
            height: 168,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box
            component='img'
            src={product.image}
            alt={product.name}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        <Stack spacing={0.75}>
          {product.sku && (
            <Typography
              variant='caption'
              sx={{
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              {product.sku}
            </Typography>
          )}

          <Typography
            variant='h6'
            component='h2'
            sx={{
              fontWeight: 800,
              fontSize: '1.04rem',
              lineHeight: 1.35,
              minHeight: '2.7em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>
        </Stack>

        <Box
          sx={{
            mt: 'auto',
            p: 1.5,
            borderRadius: 3,
            bgcolor: alpha(accent, 0.045),
            border: '1px solid',
            borderColor: alpha(accent, 0.12),
          }}
        >
          <Stack spacing={1.25}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='flex-end'
              spacing={1}
            >
              <Box>
                {hasDiscount && (
                  <Typography
                    variant='caption'
                    sx={{
                      display: 'block',
                      color: theme.palette.error.dark,
                      fontWeight: 700,
                      mb: 0.25,
                    }}
                  >
                    Discounted price
                  </Typography>
                )}

                <Stack direction='row' spacing={1} alignItems='baseline'>
                  <Typography
                    variant='h5'
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {formatPrice(activePrice)}
                  </Typography>
                  {hasDiscount && (
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                      }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Stack direction='row' spacing={0.75} flexWrap='wrap' useFlexGap>
                {hasDiscount && (
                  <Chip
                    icon={<LocalOfferOutlined sx={{ fontSize: 15 }} />}
                    label={`-${discountPercent}%`}
                    size='small'
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.dark,
                      fontWeight: 700,
                    }}
                  />
                )}
                {isInCart && quantity > 0 && (
                  <Chip
                    label={`${quantity} in cart`}
                    size='small'
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.dark,
                      fontWeight: 700,
                    }}
                  />
                )}
              </Stack>
            </Stack>

            <Button
              variant='contained'
              fullWidth
              disableElevation
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAtStockLimit}
              startIcon={isInCart ? <ShoppingCartIcon /> : <AddIcon />}
              sx={{
                py: 1.05,
                fontSize: '0.9rem',
                fontWeight: 800,
                borderRadius: 2.5,
                backgroundColor: accent,
                '&:hover': {
                  backgroundColor: alpha(accent, 0.92),
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground,
                  color: theme.palette.text.disabled,
                },
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
        </Box>
      </Stack>
    </Card>
  );
};
