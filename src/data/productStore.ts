import type { IProduct } from '../types';
import { sampleProducts } from './products';

const STORAGE_KEY = 'pos.products.v1';

const getKey = (product: IProduct) =>
  product.sku || product.barcode || product.id;

export const loadStoredProducts = (): IProduct[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as IProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveProducts = (products: IProduct[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const upsertProducts = (incoming: IProduct[]) => {
  const existing = loadStoredProducts();
  const map = new Map<string, IProduct>();

  for (const product of existing) {
    map.set(getKey(product), product);
  }

  for (const product of incoming) {
    map.set(getKey(product), product);
  }

  const merged = Array.from(map.values());
  saveProducts(merged);
  return merged;
};

export const getAllProducts = () => {
  const stored = loadStoredProducts();
  const map = new Map<string, IProduct>();

  for (const product of sampleProducts) {
    map.set(getKey(product), product);
  }

  for (const product of stored) {
    map.set(getKey(product), product);
  }

  return Array.from(map.values());
};

export const findProductByBarcode = (barcode: string) => {
  const products = getAllProducts();
  return products.find(product => product.barcode === barcode) || null;
};

export const removeProductById = (productId: string) => {
  const existing = loadStoredProducts();
  const filtered = existing.filter(product => product.id !== productId);
  saveProducts(filtered);
  return filtered;
};
