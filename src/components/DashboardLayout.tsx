import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

import { DrawerContent } from './DrawerContent';
import { UserMenu } from './UserMenu';
import { useAuth } from '../auth';

const DRAWER_WIDTH = 260;
const APP_BAR_HEIGHT = 64;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = () => setMobileOpen(prev => !prev);

  /**
   * 🔑 SINGLE SOURCE OF TRUTH FOR NAVIGATION
   */
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CssBaseline />

      {/* ───────────── TOP APP BAR ───────────── */}
      <AppBar
        position='fixed'
        sx={{
          height: APP_BAR_HEIGHT,
          background: `linear-gradient(
            135deg,
            ${theme.palette.primary.dark},
            ${theme.palette.primary.main}
          )`,
        }}
      >
        <Toolbar sx={{ minHeight: APP_BAR_HEIGHT }}>
          {isMobile && (
            <IconButton
              color='inherit'
              edge='start'
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: 600 }}>
            R7-POS
          </Typography>

          <UserMenu
            anchorEl={anchorEl}
            onMenuOpen={e => setAnchorEl(e.currentTarget)}
            onMenuClose={() => setAnchorEl(null)}
            onLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>

      {/* ───────────── SIDEBAR ───────────── */}
      <Box component='nav' sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0 }}>
        {/* Mobile Drawer */}
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              background: `linear-gradient(180deg, #1976d2, #2196f3)`,
              color: '#fff',
            },
          }}
        >
          <DrawerContent onNavigate={handleNavigate} />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant='permanent'
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              top: APP_BAR_HEIGHT,
              height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
              background: `linear-gradient(180deg, #1976d2, #2196f3)`,
              color: '#fff',
              borderRight: 'none',
            },
          }}
        >
          <DrawerContent onNavigate={handleNavigate} />
        </Drawer>
      </Box>

      {/* ───────────── MAIN CONTENT ───────────── */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          mt: `${APP_BAR_HEIGHT}px`,
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
