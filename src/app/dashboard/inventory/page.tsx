"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Package, RefreshCw } from "lucide-react";

import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import InventorySummaryCards from "@/src/components/inventory/InventorySummaryCards";
import InventoryTable from "@/src/components/inventory/InventoryTable";
import InventoryMovementTable from "@/src/components/inventory/InventoryMovementTable";
import AdjustStockDialog from "@/src/components/inventory/AdjustStockDialog";

import {
  useInventory,
  useInventorySummary,
  useInventoryMovements,
} from "@/src/hooks/useInventory";

import type {
  InventoryProduct,
  InventorySummary,
} from "@/src/types/inventory.types";

const emptySummary: InventorySummary = {
  totalProducts: 0,
  totalStockUnits: 0,
  lowStockProducts: 0,
  outOfStockProducts: 0,
};

export default function InventoryPage() {
  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProduct | null>(null);

  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useInventorySummary();

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useInventory();

  const {
    data: movements = [],
    isLoading: movementsLoading,
    isError: movementsError,
    refetch: refetchMovements,
  } = useInventoryMovements();

  function openAdjustDialog(product: InventoryProduct) {
    setSelectedProduct(product);
    setAdjustDialogOpen(true);
  }

  function closeAdjustDialog() {
    setAdjustDialogOpen(false);
    setSelectedProduct(null);
  }

  async function handleRefresh() {
    try {
      await Promise.all([
        refetchSummary(),
        refetchProducts(),
        refetchMovements(),
      ]);

      toast.success("Inventory refreshed.");
    } catch {
      toast.error("Failed to refresh inventory.");
    }
  }

  const hasError = summaryError || productsError || movementsError;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Inventory Management
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Track stock levels, manage inventory and review stock movements.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {hasError && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>
              Some inventory data could not be loaded. Check your backend
              connection and try again.
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="self-start font-semibold underline sm:self-auto"
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <section>
          <InventorySummaryCards
            summary={summary ?? emptySummary}
            isLoading={summaryLoading}
          />
        </section>

        {/* Inventory Table */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Current Stock
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View available quantities and low-stock status.
              </p>
            </div>
          </div>

          {productsError ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              Unable to load inventory products.
            </div>
          ) : (
            <InventoryTable
              products={products}
              isLoading={productsLoading}
            />
          )}

          {/* Stock Adjustment Controls */}
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="inventory-product"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Select a product to adjust stock
              </label>

              <select
                id="inventory-product"
                value={selectedProduct?.id ?? ""}
                onChange={(event) => {
                  const product =
                    products.find((item) => item.id === event.target.value) ??
                    null;

                  setSelectedProduct(product);
                }}
                disabled={productsLoading || products.length === 0}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Choose a product</option>

                {products
                  .filter((product) => product.isActive)
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} — Stock: {product.stockQuantity}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!selectedProduct || productsLoading}
              onClick={() => setAdjustDialogOpen(true)}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Adjust Stock
            </button>
          </div>
        </section>

        {/* Stock Movement History */}
        <section>
          {movementsError ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              Unable to load stock movement history.
            </div>
          ) : (
            <InventoryMovementTable
              movements={movements}
              isLoading={movementsLoading}
            />
          )}
        </section>
      </div>

      {/* Adjust Stock Dialog */}
      {adjustDialogOpen && (
        <AdjustStockDialog
          product={selectedProduct}
          onClose={closeAdjustDialog}
        />
      )}
    </DashboardLayout>
  );
}