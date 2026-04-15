import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FiberManualRecord } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { DrawerContent } from './DrawerContent';
import { UserMenu } from './UserMenu';
import { useLogout } from '../hooks/auth/useLogout';
import { getShiftStatus } from '../utils/drawer';
import { getBranchById } from '../data/branches';

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
  const logoutMutation = useLogout();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [shiftInfo, setShiftInfo] = useState(() => getShiftStatus());

  const toggleDrawer = () => setMobileOpen(prev => !prev);

  useEffect(() => {
    const handleShiftUpdate = () => {
      setShiftInfo(getShiftStatus());
    };
    window.addEventListener('drawer-shift-updated', handleShiftUpdate);
    return () =>
      window.removeEventListener('drawer-shift-updated', handleShiftUpdate);
  }, []);

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
    setAnchorEl(null);
    logoutMutation.mutate();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CssBaseline />

      {/* ───────────── TOP APP BAR ───────────── */}
      <AppBar
        position='fixed'
        elevation={0}
        sx={{
          height: APP_BAR_HEIGHT,
          background: 'rgba(255, 255, 255, 0.92)',
          borderRadius: 0,
          color: 'text.primary',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
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

          <Stack direction='row' spacing={1} alignItems='center' sx={{ mr: 2 }}>
            <FiberManualRecord
              fontSize='small'
              sx={{
                color:
                  shiftInfo.status === 'open'
                    ? theme.palette.success.main
                    : theme.palette.error.main,
              }}
            />
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {shiftInfo.status === 'open'
                ? `Shift Open · ${shiftInfo.openedBy || 'Unassigned'} · ${
                    shiftInfo.branchId
                      ? getBranchById(shiftInfo.branchId).code
                      : 'No branch'
                  }`
                : 'Shift Closed'}
            </Typography>
          </Stack>

          <UserMenu
            anchorEl={anchorEl}
            onMenuOpen={e => setAnchorEl(e.currentTarget)}
            onMenuClose={() => setAnchorEl(null)}
            onLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>

      {/* ───────────── SIDEBAR ───────────── */}
      <Box
        component='nav'
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0, borderRadius: 0 }}
      >
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
              background: `linear-gradient(180deg, ${theme.palette.primary.dark}, ${theme.palette.info.main})`,
              color: '#fff',
              border: 0,
              boxShadow: '18px 0 40px rgba(15, 23, 42, 0.12)',
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
              background: `linear-gradient(180deg, ${theme.palette.primary.dark}, ${theme.palette.info.main})`,
              color: '#fff',
              border: 0,
              boxShadow: '18px 0 40px rgba(15, 23, 42, 0.10)',
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
          background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, #ffffff 100%)`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
