import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  type CreateProductPayload,
  type Product,
} from '../api/product/productApi';
import { productKeys } from './useProductList';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProductPayload>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
