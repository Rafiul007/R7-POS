import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Home,
  Inventory,
  ShoppingCart,
  Payment,
  AccountBalanceWallet,
  UploadFile,
  Search,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { navigationItems } from './navigationConfig';

interface NavigationListProps {
  onNavigate: (path: string) => void;
}

const iconMap = {
  Home,
  Inventory,
  ShoppingCart,
  Payment,
  AccountBalanceWallet,
  UploadFile,
  Search,
  AdminPanelSettings,
};

export const NavigationList: React.FC<NavigationListProps> = ({
  onNavigate,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const { employeeType, role } = useAuth();
  const normalizedRole = role?.toLowerCase();
  const normalizedEmployeeType = employeeType?.toLowerCase();

  return (
    <Box sx={{ px: 1.5, py: 2 }}>
      <Box sx={{ px: 1.5, pb: 1.5 }}>
        <Typography
          variant='overline'
          sx={{
            color: alpha(theme.palette.common.white, 0.42),
            letterSpacing: '0.18em',
          }}
        >
          Navigation
        </Typography>
      </Box>

      <List sx={{ display: 'grid', gap: 0.5 }}>
        {navigationItems
          .filter(
            item =>
              (!item.roles ||
                item.roles.some(
                  allowedRole => allowedRole === normalizedRole
                )) &&
              (!item.employeeTypes ||
                item.employeeTypes.some(
                  allowedEmployeeType =>
                    allowedEmployeeType === normalizedEmployeeType
                ))
          )
          .map(item => {
            const IconComponent =
              iconMap[item.iconName as keyof typeof iconMap];
            const selected =
              item.path === '/admin/actions'
                ? location.pathname.startsWith('/admin')
                : location.pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selected}
                  onClick={() => onNavigate(item.path)}
                  sx={{
                    minHeight: 46,
                    px: 1.5,
                    borderRadius: 2.5,
                    color: alpha(theme.palette.common.white, 0.86),
                    '& .MuiListItemText-primary': {
                      fontWeight: selected ? 700 : 600,
                      fontSize: '0.95rem',
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      color: '#ffffff',
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.common.white,
                      },
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.06),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 38,
                      color: selected
                        ? theme.palette.common.white
                        : alpha(theme.palette.common.white, 0.64),
                    }}
                  >
                    <IconComponent fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
};
