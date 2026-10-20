export type InventoryMovementType =
  | "INCREASE"
  | "DECREASE"
  | "SALE"
  | "RESTOCK"
  | "RETURN"
  | "ADJUSTMENT";

export interface InventorySummary {
  totalProducts: number;
  totalStockUnits: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string | null;
  stockQuantity: number;
  lowStockLimit: number;
  isActive: boolean;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  organizationId: string;
  productId: string;
  createdById: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string | null;
  reference: string | null;
  createdAt: string;

  product: {
    id: string;
    name: string;
    sku: string | null;
  };

  createdBy: {
    id: string;
    name: string;
  };
}

export interface AdjustStockPayload {
  quantity: number;
  type: Exclude<InventoryMovementType, "SALE">;
  reason?: string;
}

export interface AdjustStockResponse {
  productId: string;
  previousStock: number;
  newStock: number;
  movement: InventoryMovement;
}