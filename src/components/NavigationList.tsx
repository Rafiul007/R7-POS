import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Home, Inventory, ShoppingCart, Payment } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { navigationItems } from './navigationConfig';

interface NavigationListProps {
  onNavigate: (path: string) => void;
}

const iconMap = {
  Home,
  Inventory,
  ShoppingCart,
  Payment,
};

export const NavigationList: React.FC<NavigationListProps> = ({
  onNavigate,
}) => {
  const location = useLocation();

  return (
    <List>
      {navigationItems.map(item => {
        const IconComponent = iconMap[item.iconName as keyof typeof iconMap];
        return (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => onNavigate(item.path)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  '& .MuiListItemIcon-root, & .MuiTypography-root': {
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <IconComponent />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
