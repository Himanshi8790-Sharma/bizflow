import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { orderService } from "@/src/services/order.service";

import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "@/src/types/order.types";

export const orderKeys = {
  all: ["orders"] as const,

  lists: () => [...orderKeys.all, "list"] as const,

  list: () => [...orderKeys.lists()] as const,

  details: () => [...orderKeys.all, "detail"] as const,

  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: () => orderService.getOrders(),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) =>
      orderService.createOrder(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderStatusInput;
    }) => orderService.updateOrderStatus(id, data),

    onSuccess: async (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);

      await queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),

    onSuccess: async (_order, id) => {
      await queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      await queryClient.invalidateQueries({
        queryKey: orderKeys.detail(id),
      });
    },
  });
}