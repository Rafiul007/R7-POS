import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

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

  return (
    <>
      {/* User Menu Trigger */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Welcome, User
        </Typography>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          onClick={onMenuOpen}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
            <AccountCircle />
          </Avatar>
        </IconButton>
      </Box>

      {/* User Menu Dropdown */}
      <Menu
        id="primary-search-account-menu"
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