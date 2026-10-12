import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/src/types/customer.types";
import { customerService } from "../services/customer.service";

export const customerKeys = {
  all: ["customers"] as const,

  lists: () => [...customerKeys.all, "list"] as const,

  list: (page: number, limit: number) =>
    [...customerKeys.lists(), { page, limit }] as const,

  details: () => [...customerKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...customerKeys.details(), id] as const,
};

// GET /api/customers
export function useCustomers(page = 1, limit = 10) {
  return useQuery({
    queryKey: customerKeys.list(page, limit),
    queryFn: () => customerService.getCustomers(page, limit),
  });
}

// GET /api/customers/:id
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: Boolean(id),
  });
}

// POST /api/customers
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerInput) =>
      customerService.createCustomer(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });
    },
  });
}

// PATCH /api/customers/:id
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCustomerInput;
    }) => customerService.updateCustomer(id, data),

    onSuccess: async (customer) => {
      queryClient.setQueryData(
        customerKeys.detail(customer.id),
        customer,
      );

      await queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
}

// DELETE /api/customers/:id
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      customerService.deleteCustomer(id),

    onSuccess: async (_response, id) => {
      queryClient.removeQueries({
        queryKey: customerKeys.detail(id),
      });

      await queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
}