import { useSuspenseQuery } from '@tanstack/react-query';
import { productService } from '../services';

export const useProducts = (limit?: number, skip?: number) => {
  return useSuspenseQuery({
    queryKey: ['products', limit, skip],
    queryFn: () => productService.getProducts(limit, skip),
  });
};
