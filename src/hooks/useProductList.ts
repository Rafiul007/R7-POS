import { useQuery } from '@tanstack/react-query';
import {
  getProductList,
  type Product as ApiProduct,
  type ProductListData,
  type ProductListParams,
} from '../api/product/productApi';
import type { IProduct } from '../types';

type ProductsQueryData = Omit<ProductListData, 'products'> & {
  products: IProduct[];
};

type ProductListQueryParams = {
  page: number;
  limit: number;
  search: string;
};

export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductListQueryParams) =>
    [...productKeys.all, params] as const,
};

const mapProduct = (product: ApiProduct): IProduct => ({
  id: product._id,
  name: product.name,
  price: product.price,
  image: product.images[0] ?? '',
  category: product.category.name,
  categoryId: product.category._id,
  stock: product.stock,
  description: product.metaTitle || product.category.description,
  sku: product.slug,
  isActive: product.isActive,
  createdAt: new Date(product.createdAt),
  updatedAt: new Date(product.updatedAt),
});

export const useProducts = (params: ProductListParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = params.search?.trim() ?? '';

  return useQuery<ProductListData, Error, ProductsQueryData>({
    queryKey: productKeys.list({ page, limit, search }),
    queryFn: () => getProductList({ page, limit, search }),
    select: data => ({
      ...data,
      products: data.products.map(mapProduct),
    }),
  });
};
