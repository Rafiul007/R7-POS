import type { IProduct } from '../types';

export const sampleProducts: IProduct[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    discountPrice: 69.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Electronics',
    stock: 15,
    description:
      'High-quality wireless headphones with noise cancellation and premium sound.',
    sku: 'WH-001',
    barcode: '0123456789012',
  },
  {
    id: '2',
    name: 'Organic Coffee Beans',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    category: 'Food & Beverage',
    stock: 8,
    description: 'Premium organic coffee beans sourced from sustainable farms.',
    sku: 'CF-002',
    barcode: '0987654321098',
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199.99,
    discountPrice: 149.99,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Electronics',
    stock: 0,
    description:
      'Advanced fitness tracking with heart rate monitoring and GPS.',
    sku: 'FW-003',
    barcode: '1234509876543',
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    category: 'Furniture',
    stock: 3,
    description: 'Comfortable ergonomic chair designed for long work sessions.',
    sku: 'OC-004',
    barcode: '2222333344445',
  },
];

export const findProductByBarcode = (barcode: string) =>
  sampleProducts.find(product => product.barcode === barcode) || null;
