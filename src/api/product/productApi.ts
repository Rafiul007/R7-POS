import axiosInstance from '../../lib/axiosInstance';

const PRODUCT_LIST_URL = 'product-catalog/products';

export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ProductCategory = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ProductVariant = {
  name: string;
  value: string;
  additionalPrice: number;
  stock: number;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  reorderLevel: number;
  category: ProductCategory;
  images: string[];
  variants: ProductVariant[];
  availableInStore: boolean;
  availableOnline: boolean;
  taxRate: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  deletedAt: string | null;
  metaTitle: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ProductListPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ProductListData = {
  products: Product[];
  pagination: ProductListPagination;
};

type ProductListResponse = {
  success: boolean;
  message: string;
  data: ProductListData;
};

export const getProductList = async ({
  page = 1,
  limit = 10,
  search = '',
}: ProductListParams = {}): Promise<ProductListData> => {
  const res = await axiosInstance.get<ProductListResponse>(PRODUCT_LIST_URL, {
    params: { page, limit, search: search || undefined },
  });

  return res.data.data;
};
