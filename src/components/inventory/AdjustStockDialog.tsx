"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdjustStock } from "@/src/hooks/useInventory";

import type {
  InventoryProduct,
} from "@/src/types/inventory.types";

interface AdjustStockDialogProps {
  product: InventoryProduct | null;
  onClose: () => void;
}

export default function AdjustStockDialog({
  product,
  onClose,
}: AdjustStockDialogProps) {
  const [quantity, setQuantity] = useState("");
const [type, setType] = useState<
  "INCREASE" | "DECREASE" | "RESTOCK" | "RETURN"
>("INCREASE");
  const [reason, setReason] = useState("");

  const adjustStock = useAdjustStock();

  useEffect(() => {
    setQuantity("");
    setType("INCREASE");
    setReason("");
  }, [product]);

  if (!product) {
    return null;
  }

  const parsedQuantity = Number(quantity);

  const isQuantityValid =
    quantity.trim() !== "" &&
    Number.isSafeInteger(parsedQuantity) &&
    parsedQuantity > 0;

  const isDecrease = type === "DECREASE";

  const hasSufficientStock =
    !isDecrease || parsedQuantity <= product.stockQuantity;

  const canSubmit =
    isQuantityValid && hasSufficientStock && !adjustStock.isPending;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

  if (!product) {
    toast.error("Please select a product.");
    return;
  }

  if (!isQuantityValid) {
    toast.error("Enter a valid positive whole number.");
    return;
  }

  if (!hasSufficientStock) {
    toast.error("Quantity cannot exceed the available stock.");
    return;
  }

    try {
      await adjustStock.mutateAsync({
        productId: product.id,
        payload: {
          quantity: parsedQuantity,
          type,
          ...(reason.trim() ? { reason: reason.trim() } : {}),
        },
      });

      toast.success("Stock updated successfully.");
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update stock.";

      toast.error(message);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !adjustStock.isPending) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="adjust-stock-title"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-6">
          <h2
            id="adjust-stock-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Adjust Stock
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update inventory for {product.name}.
          </p>
        </div>

        <div className="mb-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current stock
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {product.stockQuantity}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="movement-type"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Movement Type
            </label>

            <select
              id="movement-type"
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value as
                    | "INCREASE"
                    | "DECREASE"
                    | "RESTOCK"
                    | "RETURN",
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="INCREASE">Increase Stock</option>
              <option value="DECREASE">Decrease Stock</option>
              <option value="RESTOCK">Restock</option>
              <option value="RETURN">Customer Return</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="stock-quantity"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Quantity
            </label>

            <input
              id="stock-quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="Enter quantity"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            {isQuantityValid && !hasSufficientStock && (
              <p className="mt-1 text-xs text-red-600">
                Available stock is only {product.stockQuantity}.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="stock-reason"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reason (Optional)
            </label>

            <textarea
              id="stock-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Why is the stock changing?"
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={adjustStock.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {adjustStock.isPending ? "Updating..." : "Update Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}