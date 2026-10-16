import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/src/types/product.types";

import { productService } from "../services/product.service";

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (page: number, limit: number) =>
    [...productKeys.lists(), { page, limit }] as const,

  details: () => [...productKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...productKeys.details(), id] as const,
};

// GET /api/products
export function useProducts(page = 1, limit = 10) {
  return useQuery({
    queryKey: productKeys.list(page, limit),
    queryFn: () => productService.getProducts(page, limit),
  });
}

// GET /api/products/:id
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });
}

// POST /api/products
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      productService.createProduct(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
}

// PATCH /api/products/:id
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductInput;
    }) => productService.updateProduct(id, data),

    onSuccess: async (product) => {
      queryClient.setQueryData(
        productKeys.detail(product.id),
        product,
      );

      await queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
}

// DELETE /api/products/:id
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      productService.deleteProduct(id),

    onSuccess: async (_response, id) => {
      queryClient.removeQueries({
        queryKey: productKeys.detail(id),
      });

      await queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
}