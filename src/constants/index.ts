export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'POS System',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  SALES: '/sales',
  INVENTORY: '/inventory',
  PAYMENTS: '/payments',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  LOGIN: '/login',
};
