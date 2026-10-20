import {api} from "@/src/lib/api";

import type {
  InventorySummary,
  InventoryProduct,
  InventoryMovement,
  AdjustStockPayload,
  AdjustStockResponse,
} from "@/src/types/inventory.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const inventoryService = {
  // GET /api/inventory/summary
  async getInventorySummary(): Promise<InventorySummary> {
    const response = await api.get<ApiResponse<InventorySummary>>(
      "/inventory/summary",
    );

    return response.data.data;
  },

  // GET /api/inventory
  async getInventory(): Promise<InventoryProduct[]> {
    const response = await api.get<ApiResponse<InventoryProduct[]>>(
      "/inventory",
    );

    return response.data.data;
  },

  // GET /api/inventory/low-stock
  async getLowStockProducts(): Promise<InventoryProduct[]> {
    const response = await api.get<ApiResponse<InventoryProduct[]>>(
      "/inventory/low-stock",
    );

    return response.data.data;
  },

  // GET /api/inventory/movements
  async getMovementHistory(
    productId?: string,
  ): Promise<InventoryMovement[]> {
    const response = await api.get<ApiResponse<InventoryMovement[]>>(
      "/inventory/movements",
      {
        params: productId ? { productId } : undefined,
      },
    );

    return response.data.data;
  },

  // PATCH /api/inventory/:productId/adjust
  async adjustStock(
    productId: string,
    payload: AdjustStockPayload,
  ): Promise<AdjustStockResponse> {
    const response = await api.patch<ApiResponse<AdjustStockResponse>>(
      `/inventory/${productId}/adjust`,
      payload,
    );

    return response.data.data;
  },
};

export default inventoryService;