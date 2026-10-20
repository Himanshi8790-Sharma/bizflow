import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { inventoryService } from "@/src/services/inventory.service";

import type { AdjustStockPayload } from "@/src/types/inventory.types";

export const inventoryKeys = {
  all: ["inventory"] as const,
  summary: ["inventory", "summary"] as const,
  products: ["inventory", "products"] as const,
  lowStock: ["inventory", "low-stock"] as const,
  movements: (productId?: string) =>
    ["inventory", "movements", productId ?? "all"] as const,
};

// Inventory summary
export function useInventorySummary() {
  return useQuery({
    queryKey: inventoryKeys.summary,
    queryFn: inventoryService.getInventorySummary,
  });
}

// Inventory products
export function useInventory() {
  return useQuery({
    queryKey: inventoryKeys.products,
    queryFn: inventoryService.getInventory,
  });
}

// Low-stock products
export function useLowStockProducts() {
  return useQuery({
    queryKey: inventoryKeys.lowStock,
    queryFn: inventoryService.getLowStockProducts,
  });
}

// Inventory movement history
export function useInventoryMovements(productId?: string) {
  return useQuery({
    queryKey: inventoryKeys.movements(productId),
    queryFn: () => inventoryService.getMovementHistory(productId),
  });
}

// Adjust stock
export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: AdjustStockPayload;
    }) => inventoryService.adjustStock(productId, payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: inventoryKeys.all,
        }),
      ]);
    },
  });
}