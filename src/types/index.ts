// Product interfaces for POS system

export interface IProduct {
  id: string;
  name: string;
  price: number;
  discountPrice?: number; // Optional discount price
  image: string; // Image URL or path
  category?: string;
  stock?: number;
  description?: string;
  sku?: string; // Stock Keeping Unit
  barcode?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  notes?: string; // Special instructions for the item
}

export interface IProductCardProps {
  product: IProduct;
  onAddToCart: (product: IProduct) => void;
  isInCart?: boolean;
  quantity?: number;
  isAtStockLimit?: boolean;
}

export * from './form-types';
