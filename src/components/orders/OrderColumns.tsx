"use client";

import type { DataTableColumn } from "@/src/components/ui/data-table/DataTable";
import type { Order } from "@/src/types/order.types";
import OrderStatusBadge from "@/src/components/orders/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { Eye, RefreshCw, XCircle } from "lucide-react";

interface OrderColumnsProps {
  onView: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
  onCancel: (order: Order) => void;
  canManage?: boolean;
}

export function getOrderColumns({
  onView,
  onUpdateStatus,
  onCancel,
  canManage = true,
}: OrderColumnsProps): DataTableColumn<Order>[] {
  return [
    {
      id: "orderNumber",
      header: "Order #",
      cell: (order) => (
        <div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {order.orderNumber || `#${order.id.slice(0, 8).toUpperCase()}`}
          </span>
          <p className="font-mono text-[11px] text-gray-400">
            {order.id.slice(0, 10)}...
          </p>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: (order) => {
        const customerName = order.customer?.name ?? "Walk-in Customer";
        const initial = customerName.charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              {initial}
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {customerName}
            </span>
          </div>
        );
      },
    },
    {
      id: "date",
      header: "Date",
      cell: (order) => (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(order.createdAt)}
        </span>
      ),
    },
    {
      id: "items",
      header: "Items",
      cell: (order) => {
        const itemCount = (order.items ?? []).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return (
          <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {itemCount} {itemCount === 1 ? "unit" : "units"}
          </span>
        );
      },
    },
    {
      id: "amount",
      header: "Total Amount",
      cell: (order) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(order.totalAmount)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Order Status",
      cell: (order) => <OrderStatusBadge status={order.status} />,
    },
    {
      id: "paymentStatus",
      header: "Payment",
      cell: (order) => <OrderStatusBadge status={order.paymentStatus} />,
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (order) => {
        const isClosed =
          order.status === "COMPLETED" || order.status === "CANCELLED";

        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onView(order)}
              title="View Order Details"
              aria-label={`View order ${order.orderNumber}`}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Eye size={13} />
              <span>View</span>
            </button>

            {canManage && !isClosed && (
              <>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order)}
                  title="Update status"
                  aria-label={`Update status for ${order.orderNumber}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 shadow-2xs transition hover:bg-indigo-100/60 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300"
                >
                  <RefreshCw size={13} />
                  <span>Status</span>
                </button>

                <button
                  type="button"
                  onClick={() => onCancel(order)}
                  title="Cancel order"
                  aria-label={`Cancel order ${order.orderNumber}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-2 py-1.5 text-xs font-medium text-red-600 shadow-2xs transition hover:bg-red-100/60 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                >
                  <XCircle size={13} />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];
}
