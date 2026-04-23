import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { NavigationList } from './NavigationList';
import { CartSection } from './CartSection';
import { CartModal } from './CartModal';

interface DrawerContentProps {
  onNavigate: (path: string) => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ onNavigate }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const handleCartClick = () => {
    setCartModalOpen(true);
  };

  const handleCartModalClose = () => {
    setCartModalOpen(false);
  };

  const handleProceedToPayment = () => {
    navigate('/cart-payment');
    setCartModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: `radial-gradient(circle at top left, ${alpha(
            theme.palette.primary.main,
            0.14
          )} 0%, transparent 20%)`,
        }}
      >
        <Stack
          direction='row'
          spacing={1.5}
          alignItems='center'
          sx={{ px: 2.5, pt: 3, pb: 2 }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
            }}
          >
            R7
          </Box>
          <Stack spacing={0.2}>
            <Typography
              variant='body2'
              sx={{ color: '#F7F8FB', fontWeight: 700 }}
            >
              R7-POS
            </Typography>
            <Typography
              variant='caption'
              sx={{ color: alpha(theme.palette.common.white, 0.56) }}
            >
              Retail command center
            </Typography>
          </Stack>
        </Stack>
        <NavigationList onNavigate={onNavigate} />
        <CartSection onClick={handleCartClick} />
      </Box>

      <CartModal
        open={cartModalOpen}
        onClose={handleCartModalClose}
        onProceedToPayment={handleProceedToPayment}
      />
    </>
  );
};
