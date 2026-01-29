import React, { useState } from 'react';
import { Box } from '@mui/material';
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
