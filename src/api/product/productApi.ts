import axiosInstance from '../../lib/axiosInstance';

const PRODUCT_LIST_URL = 'product-catalog/products';
const PRODUCT_CREATE_URL = 'product-catalog/products/create';
const CATEGORY_LIST_URL = 'product-catalog/categories';

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

export type CategoryListParams = {
  page?: number;
  limit?: number;
};

export type ProductVariant = {
  name: string;
  value: string;
  additionalPrice: number;
  stock: number;
};

export type CreateProductPayload = {
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  tags: string[];
  variants: ProductVariant[];
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

export type CategoryListData = {
  categories: ProductCategory[];
  pagination: ProductListPagination;
};

type ProductListResponse = {
  success: boolean;
  message: string;
  data: ProductListData;
};

type CategoryListResponse = {
  success: boolean;
  message: string;
  data: CategoryListData;
};

type CreateProductResponse = {
  success: boolean;
  message: string;
  data: Product | { product: Product };
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

export const getCategoryList = async ({
  page = 1,
  limit = 20,
}: CategoryListParams = {}): Promise<CategoryListData> => {
  const res = await axiosInstance.get<CategoryListResponse>(CATEGORY_LIST_URL, {
    params: { page, limit },
  });

  return res.data.data;
};

export const createProduct = async (
  payload: CreateProductPayload
): Promise<CreateProductResponse> => {
  const res = await axiosInstance.post<CreateProductResponse>(
    PRODUCT_CREATE_URL,
    payload
  );

  return res.data;
};
