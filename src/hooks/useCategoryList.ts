import { useQuery } from '@tanstack/react-query';
import {
  getCategoryList,
  type CategoryListData,
  type CategoryListParams,
  type ProductCategory,
} from '../api/product/productApi';

export type CategoryOption = {
  value: string;
  label: string;
};

type CategoryListQueryParams = {
  page: number;
  limit: number;
};

export const categoryKeys = {
  all: ['categories'] as const,
  list: (params: CategoryListQueryParams) =>
    [...categoryKeys.all, params] as const,
};

export const mapCategoryToOption = (
  category: ProductCategory
): CategoryOption => ({
  value: category._id,
  label: category.name,
});

export const useCategories = (params: CategoryListParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  return useQuery<CategoryListData, Error>({
    queryKey: categoryKeys.list({ page, limit }),
    queryFn: () => getCategoryList({ page, limit }),
  });
};
