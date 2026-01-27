import React from 'react';
import { Box, Typography, Divider, Avatar, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import { selectCartTotalItems, selectCartTotalPrice } from '../store/selectors';

interface CartSectionProps {
  onClick?: () => void;
}

export const CartSection: React.FC<CartSectionProps> = ({ onClick }) => {
  const itemCount = useAppSelector(selectCartTotalItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  return (
    <>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', mt: 'auto' }} />
      <Box
        onClick={onClick}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
          mx: 1,
          mb: 1,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': onClick ? {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)',
          } : {},
        }}
      >
        <Badge
          badgeContent={itemCount}
          color='secondary'
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#ff6b6b',
              color: 'white',
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              width: 40,
              height: 40,
            }}
          >
            <ShoppingCart sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
          </Avatar>
        </Badge>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant='body2'
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.75rem',
            }}
          >
            Cart Total
          </Typography>
          <Typography
            variant='h6'
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
