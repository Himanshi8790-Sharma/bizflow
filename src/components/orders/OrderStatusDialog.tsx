"use client";

import { useState, useEffect } from "react";
import type { Order, UpdatableOrderStatus } from "@/src/types/order.types";
import { RefreshCw, X, CheckCircle2 } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderStatusDialogProps {
  isOpen: boolean;
  order: Order | null;
  isUpdating: boolean;
  onClose: () => void;
  onConfirm: (order: Order, newStatus: UpdatableOrderStatus) => void;
}

const statusOptions: {
  status: UpdatableOrderStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "CONFIRMED",
    title: "Confirmed",
    description: "Order is verified and inventory has been reserved.",
  },
  {
    status: "PROCESSING",
    title: "Processing",
    description: "Order is being packed and prepared for dispatch.",
  },
  {
    status: "COMPLETED",
    title: "Completed",
    description: "Order has been fulfilled and delivered to customer.",
  },
];

export default function OrderStatusDialog({
  isOpen,
  order,
  isUpdating,
  onClose,
  onConfirm,
}: OrderStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<UpdatableOrderStatus>("CONFIRMED");

  useEffect(() => {
    if (order) {
      if (order.status === "CONFIRMED" || order.status === "PROCESSING") {
        setSelectedStatus(order.status);
      } else if (order.status === "PENDING") {
        setSelectedStatus("CONFIRMED");
      }
    }
  }, [order]);

  if (!isOpen || !order) {
    return null;
  }

  const orderIdentifier = order.orderNumber || `#${order.id.slice(0, 8)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUpdating) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-status-title"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-fade-in-rise dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <RefreshCw size={22} />
            </div>

            <div>
              <h2
                id="update-status-title"
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                Update Order Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {orderIdentifier} · Currently{" "}
                <span className="font-semibold">{order.status}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Close dialog"
            className="rounded-xl p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Options */}
        <div className="mt-5 space-y-2.5">
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.status;
            const isCurrent = order.status === option.status;

            return (
              <label
                key={option.status}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/30"
                    : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-850"
                }`}
              >
                <input
                  type="radio"
                  name="order-status"
                  value={option.status}
                  checked={isSelected}
                  onChange={() => setSelectedStatus(option.status)}
                  disabled={isUpdating}
                  className="mt-0.5 accent-indigo-600"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {option.title}
                    </span>
                    {isCurrent && (
                      <span className="rounded-md bg-gray-100 px-1.5 py-0.2 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(order, selectedStatus)}
            disabled={isUpdating || selectedStatus === order.status}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
