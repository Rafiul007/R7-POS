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
    text: 'Branch Search',
    iconName: 'Search',
    path: '/branch-search',
  },
  {
    text: 'Payments',
    iconName: 'Payment',
    path: '/payments',
  },
  {
    text: 'Drawer',
    iconName: 'AccountBalanceWallet',
    path: '/drawer',
  },
  {
    text: 'Bulk Upload',
    iconName: 'UploadFile',
    path: '/bulk-upload',
  },
];

export const DRAWER_WIDTH = 280;
