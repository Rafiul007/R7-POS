import React from 'react';
import { Box, Typography, Divider, Avatar, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppSelector } from '../store/hooks';
import { selectCartTotalItems, selectCartTotalPrice } from '../store/selectors';

interface CartSectionProps {
  onClick?: () => void;
}

export const CartSection: React.FC<CartSectionProps> = ({ onClick }) => {
  const theme = useTheme();
  const itemCount = useAppSelector(selectCartTotalItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  return (
    <>
      <Divider sx={{ mt: 'auto', mx: 2 }} />
      <Box
        onClick={onClick}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: alpha(theme.palette.common.white, 0.05),
          border: '1px solid',
          borderColor: alpha(theme.palette.common.white, 0.08),
          borderRadius: 3,
          mx: 2,
          mt: 1.5,
          mb: 2,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': onClick
            ? {
                backgroundColor: alpha(theme.palette.common.white, 0.08),
              }
            : {},
        }}
      >
        <Badge
          badgeContent={itemCount}
          color='secondary'
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.16),
              width: 40,
              height: 40,
            }}
          >
            <ShoppingCart sx={{ color: theme.palette.primary.light }} />
          </Avatar>
        </Badge>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant='body2'
            sx={{
              color: alpha(theme.palette.common.white, 0.64),
              fontSize: '0.75rem',
            }}
          >
            Cart Total
          </Typography>
          <Typography
            variant='h6'
            sx={{
              color: '#ffffff',
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
