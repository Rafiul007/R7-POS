import React from 'react';
import { Box, Toolbar, Typography, Divider } from '@mui/material';
import { NavigationList } from './NavigationList';
import { CartSection } from './CartSection';

interface DrawerContentProps {
  onNavigate: (path: string) => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ onNavigate }) => {
  return (
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
      <CartSection />
    </Box>
  );
};
