"use client";

import { useState } from "react";
import type {
  Order,
  UpdatableOrderStatus,
} from "@/src/types/order.types";

interface OrderActionsProps {
  order: Order;
  canManage?: boolean;
  isUpdating?: boolean;
  isCancelling?: boolean;
  onView: (order: Order) => void;
  onUpdateStatus: (order: Order, status: UpdatableOrderStatus) => void;
  onCancel: (order: Order) => void;
}

const availableStatuses: UpdatableOrderStatus[] = [
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
];

export default function OrderActions({
  order,
  canManage = false,
  isUpdating = false,
  isCancelling = false,
  onView,
  onUpdateStatus,
  onCancel,
}: OrderActionsProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<UpdatableOrderStatus | "">(
      order.status === "CONFIRMED" || order.status === "PROCESSING"
        ? order.status
        : "",
    );

  const isFinalStatus =
    order.status === "COMPLETED" || order.status === "CANCELLED";

  const isBusy = isUpdating || isCancelling;

  return (
    <div className="flex min-w-40 flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => onView(order)}
        className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        View details
      </button>

      {canManage && !isFinalStatus && (
        <>
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value as UpdatableOrderStatus | "",
                )
              }
              disabled={isBusy}
              aria-label="Select new order status"
              className="max-w-36 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="" disabled>
                Select status
              </option>
              {order.status === "PENDING" && (
                <option value="PENDING" disabled>
                  Pending
                </option>
              )}
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={
                isBusy || !selectedStatus || selectedStatus === order.status
              }
              onClick={() => {
                if (selectedStatus) {
                  onUpdateStatus(order, selectedStatus);
                }
              }}
              className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Update"}
            </button>
          </div>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => onCancel(order)}
            className="text-xs font-medium text-red-600 transition hover:text-red-800 disabled:opacity-50 dark:text-red-400"
          >
            {isCancelling ? "Cancelling..." : "Cancel order"}
          </button>
        </>
      )}
    </div>
  );
}