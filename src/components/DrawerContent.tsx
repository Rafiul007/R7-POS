import React, { useState } from 'react';
import { Box, Toolbar, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NavigationList } from './NavigationList';
import { CartSection } from './CartSection';
import { CartModal } from './CartModal';

interface DrawerContentProps {
  onNavigate: (path: string) => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ onNavigate }) => {
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Toolbar>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}
          >
            POS System
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
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
