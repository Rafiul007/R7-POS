import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  type CreateProductPayload,
} from '../api/product/productApi';
import { productKeys } from './useProductList';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
