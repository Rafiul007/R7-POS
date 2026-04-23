import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { FiberManualRecord, KeyboardArrowDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { DrawerContent } from './DrawerContent';
import { UserMenu } from './UserMenu';
import { useLogout } from '../hooks/auth/useLogout';
import { getShiftStatus } from '../utils/drawer';
import { getBranchById } from '../data/branches';

const DRAWER_WIDTH = 260;
const APP_BAR_HEIGHT = 72;

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
  const activeBranch = shiftInfo.branchId
    ? getBranchById(shiftInfo.branchId)
    : getBranchById('branch-nyc');

  const toggleDrawer = () => setMobileOpen(prev => !prev);

  useEffect(() => {
    const handleShiftUpdate = () => {
      setShiftInfo(getShiftStatus());
    };
    window.addEventListener('drawer-shift-updated', handleShiftUpdate);
    return () =>
      window.removeEventListener('drawer-shift-updated', handleShiftUpdate);
  }, []);

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
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <CssBaseline />

      <AppBar
        position='fixed'
        sx={{
          height: APP_BAR_HEIGHT,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: alpha(theme.palette.background.paper, 0.92),
          color: 'text.primary',
          backdropFilter: 'blur(18px)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: APP_BAR_HEIGHT,
            px: { xs: 2, md: 4 },
            gap: 2,
          }}
        >
          {isMobile && (
            <IconButton
              color='default'
              edge='start'
              onClick={toggleDrawer}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Paper
            sx={{
              flexGrow: 1,
              maxWidth: 360,
              px: 2,
              py: 1.25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              borderRadius: 3,
            }}
          >
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography
                variant='body2'
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
                noWrap
              >
                {activeBranch.name}
              </Typography>
              <Typography variant='caption' color='text.secondary' noWrap>
                {activeBranch.code} · {activeBranch.city}
              </Typography>
            </Stack>
            <KeyboardArrowDown
              sx={{ color: 'text.secondary', flexShrink: 0 }}
              fontSize='small'
            />
          </Paper>

          <Stack
            direction='row'
            spacing={1.25}
            alignItems='center'
            sx={{
              px: 1.5,
              py: 0.85,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderRadius: 999,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <FiberManualRecord
              fontSize='inherit'
              sx={{
                fontSize: 10,
                color:
                  shiftInfo.status === 'open'
                    ? theme.palette.success.main
                    : theme.palette.error.main,
              }}
            />
            <Typography
              variant='body2'
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {shiftInfo.status === 'open'
                ? `Shift Open · ${shiftInfo.openedBy || 'Unassigned'}`
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

      <Box component='nav' sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0 }}>
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              background: `linear-gradient(180deg, ${theme.palette.common.black} 0%, ${alpha(
                '#101217',
                0.98
              )} 100%)`,
              color: '#f7f8fb',
            },
          }}
        >
          <DrawerContent onNavigate={handleNavigate} />
        </Drawer>

        <Drawer
          variant='permanent'
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              height: '100%',
              background: `linear-gradient(180deg, ${theme.palette.common.black} 0%, ${alpha(
                '#101217',
                0.98
              )} 100%)`,
              color: '#f7f8fb',
            },
          }}
        >
          <DrawerContent onNavigate={handleNavigate} />
        </Drawer>
      </Box>

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
