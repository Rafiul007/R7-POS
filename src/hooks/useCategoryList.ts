import { useQuery } from '@tanstack/react-query';
import {
  getCategoryList,
  type CategoryListData,
  type CategoryListParams,
} from '../api/product/productApi';

type CategoryListQueryParams = {
  page: number;
  limit: number;
};

export const categoryKeys = {
  all: ['categories'] as const,
  list: (params: CategoryListQueryParams) =>
    [...categoryKeys.all, params] as const,
};

export const useCategories = (params: CategoryListParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  return useQuery<CategoryListData, Error>({
    queryKey: categoryKeys.list({ page, limit }),
    queryFn: () => getCategoryList({ page, limit }),
  });
};
