"use client";

import { useMemo } from "react";

import DataTable from "@/src/components/ui/data-table/DataTable";
import type { DataTableColumn } from "@/src/components/ui/data-table/DataTable";
import OrderStatusBadge from "@/src/components/orders/OrderStatusBadge";

import type { Order } from "@/src/types/order.types";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onViewOrder: (order: Order) => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersTable({
  orders,
  isLoading,
  isError,
  errorMessage = "Unable to load orders.",
  onRetry,
  search,
  onSearchChange,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onViewOrder,
}: OrdersTableProps) {
  const columns = useMemo<DataTableColumn<Order>[]>(
    () => [
      {
        id: "id",
        header: "Order ID",
        cell: (order) => (
          <span className="font-semibold text-gray-900 dark:text-white">
            {order.orderNumber ?? `#${order.id.slice(0, 8).toUpperCase()}`}
          </span>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        cell: (order) => (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {order.customer?.name ?? "Unknown customer"}
          </span>
        ),
      },
      {
        id: "createdAt",
        header: "Order Date",
        cell: (order) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(order.createdAt)}
          </span>
        ),
      },
      {
        id: "totalAmount",
        header: "Total",
        cell: (order) => (
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(order.totalAmount)}
          </span>
        ),
      },
      {
        id: "status",
        header: "Order Status",
        cell: (order) => (
          <OrderStatusBadge status={order.status} />
        ),
      },
      {
        id: "paymentStatus",
        header: "Payment",
        cell: (order) => (
          <OrderStatusBadge status={order.paymentStatus} />
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: (order) => (
          <button
            type="button"
            onClick={() => onViewOrder(order)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            View details
          </button>
        ),
      },
    ],
    [onViewOrder],
  );

  return (
    <DataTable
      columns={columns}
      data={orders}
      getRowId={(order) => order.id}
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search orders..."
      emptyTitle={search ? "No matching orders" : "No orders yet"}
      emptyDescription={
        search
          ? "Try a different order ID or customer name."
          : "Create your first order to get started."
      }
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      toolbarActions={null}
    />
  );
}