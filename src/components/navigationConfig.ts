export interface NavigationItem {
  text: string;
  iconName: string;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  {
    text: 'Home',
    iconName: 'Home',
    path: '/',
  },
  {
    text: 'Stock',
    iconName: 'Inventory',
    path: '/inventory',
  },
  {
    text: 'Products',
    iconName: 'ShoppingCart',
    path: '/products',
  },
  {
    text: 'Payments',
    iconName: 'Payment',
    path: '/payments',
  },
];

export const DRAWER_WIDTH = 280;
