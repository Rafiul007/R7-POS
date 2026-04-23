import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  type CreateCategoryPayload,
  type ProductCategory,
} from '../api/product/productApi';
import { categoryKeys } from './useCategoryList';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductCategory, Error, CreateCategoryPayload>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};
