import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  ButtonBase,
  Menu,
  MenuItem,
  Divider,
  Stack,
} from '@mui/material';
import {
  AccountCircle,
  KeyboardArrowDown,
  Logout,
  NotificationsNone,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from '../auth';

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onLogout,
}) => {
  const theme = useTheme();
  const { role } = useAuth();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size='small'
          aria-label='notifications'
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          <NotificationsNone fontSize='small' />
        </IconButton>

        <ButtonBase
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          onClick={onMenuOpen}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.25,
              py: 0.75,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: alpha(theme.palette.primary.main, 0.14),
                color: theme.palette.primary.dark,
              }}
            >
              <AccountCircle />
            </Avatar>
            <Stack
              spacing={0.1}
              sx={{ display: { xs: 'none', sm: 'flex' }, textAlign: 'left' }}
            >
              <Typography variant='body2' sx={{ fontWeight: 700 }}>
                Store Admin
              </Typography>
              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                {role ? `${role[0].toUpperCase()}${role.slice(1)}` : 'Staff'}
              </Typography>
            </Stack>
            <KeyboardArrowDown
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: alpha(theme.palette.text.secondary, 0.9),
              }}
              fontSize='small'
            />
          </Box>
        </ButtonBase>
      </Box>

      <Menu
        id='primary-search-account-menu'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItem onClick={onMenuClose}>
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={onMenuClose}>
          <Typography>Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <Logout sx={{ mr: 1 }} />
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
