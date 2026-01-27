import { Box, Container } from '@mui/material';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth='lg' sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};
