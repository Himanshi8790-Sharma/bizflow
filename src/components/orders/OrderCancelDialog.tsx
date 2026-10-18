"use client";

import type { Order } from "@/src/types/order.types";
import { AlertTriangle, X } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

interface OrderCancelDialogProps {
  isOpen: boolean;
  order: Order | null;
  isCancelling: boolean;
  onClose: () => void;
  onConfirm: (order: Order) => void;
}

export default function OrderCancelDialog({
  isOpen,
  order,
  isCancelling,
  onClose,
  onConfirm,
}: OrderCancelDialogProps) {
  if (!isOpen || !order) {
    return null;
  }

  const orderIdentifier = order.orderNumber || `#${order.id.slice(0, 8)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isCancelling) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancel-order-title"
        aria-describedby="cancel-order-description"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-fade-in-rise dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>

          <div className="flex-1">
            <h2
              id="cancel-order-title"
              className="text-lg font-bold text-gray-900 dark:text-white"
            >
              Cancel Order
            </h2>

            <p
              id="cancel-order-description"
              className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
            >
              Are you sure you want to cancel{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {orderIdentifier}
              </span>{" "}
              ({formatCurrency(order.totalAmount)})? This will restore stock to
              all items in the order and mark it as cancelled.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            aria-label="Close dialog"
            className="rounded-xl p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Keep Order
          </button>

          <button
            type="button"
            onClick={() => onConfirm(order)}
            disabled={isCancelling}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
