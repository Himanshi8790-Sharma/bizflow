"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DataTable from "@/src/components/ui/data-table/DataTable";
import OrdersPageHeader from "@/src/components/orders/OrdersPageHeader";
import { getOrderColumns } from "@/src/components/orders/OrderColumns";
import OrderStatusDialog from "@/src/components/orders/OrderStatusDialog";
import OrderCancelDialog from "@/src/components/orders/OrderCancelDialog";

import {
  useOrders,
  useUpdateOrderStatus,
  useCancelOrder,
} from "@/src/hooks/useOrders";
import { useMe } from "@/src/hooks/useAuth";
import { getErrorMessage } from "@/src/lib/utils";

import type {
  Order,
  OrderStatus,
  UpdatableOrderStatus,
} from "@/src/types/order.types";

const PAGE_SIZE = 10;
const EMPTY_ORDERS: Order[] = [];

type OrderStatusFilter = "ALL" | OrderStatus;

const filterPills: { label: string; value: OrderStatusFilter }[] = [
  { label: "All Orders", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function OrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("ALL");

  const [orderToUpdateStatus, setOrderToUpdateStatus] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  const { data: me } = useMe();
  const { data, isLoading, isError, error, refetch } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  const user = me as
    | {
        role?: string;
        user?: { role?: string };
        data?: { role?: string };
      }
    | undefined;

  const role = user?.role ?? user?.user?.role ?? user?.data?.role;
  const canManage = role ? ["ADMIN", "MANAGER"].includes(role) : true;

  const orders = data ?? EMPTY_ORDERS;

  // Filter orders by search string and status filter
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !term ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(term)) ||
        order.id.toLowerCase().includes(term) ||
        (order.customer?.name && order.customer.name.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredOrders, page]);

  // Handlers
  function handleViewOrder(order: Order) {
    router.push(`/dashboard/orders/${order.id}`);
  }

  async function handleConfirmStatusUpdate(
    order: Order,
    newStatus: UpdatableOrderStatus
  ) {
    try {
      await updateStatusMutation.mutateAsync({
        id: order.id,
        data: { status: newStatus },
      });
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
      setOrderToUpdateStatus(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update order status"));
    }
  }

  async function handleConfirmCancel(order: Order) {
    try {
      await cancelOrderMutation.mutateAsync(order.id);
      toast.success("Order cancelled and inventory restored");
      setOrderToCancel(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to cancel order"));
    }
  }

  const columns = useMemo(
    () =>
      getOrderColumns({
        onView: handleViewOrder,
        onUpdateStatus: (order) => setOrderToUpdateStatus(order),
        onCancel: (order) => setOrderToCancel(order),
        canManage,
      }),
    [canManage]
  );

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl">
        <OrdersPageHeader
          totalOrders={totalOrders}
          pendingOrders={pendingOrders}
          completedOrders={completedOrders}
        />

        {/* Status Filter Tabs / Pills */}
        <div className="mb-5 flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {filterPills.map((pill) => {
            const isSelected = statusFilter === pill.value;
            const count =
              pill.value === "ALL"
                ? totalOrders
                : orders.filter((o) => o.status === pill.value).length;

            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => {
                  setStatusFilter(pill.value);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "border border-gray-200/80 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={paginatedOrders}
          getRowId={(order) => order.id}
          isLoading={isLoading}
          isError={isError}
          errorMessage={getErrorMessage(
            error,
            "Unable to load orders. Please try again."
          )}
          onRetry={() => void refetch()}
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Search by order #, ID, or customer name..."
          emptyTitle={
            search || statusFilter !== "ALL"
              ? "No matching orders found"
              : "No orders yet"
          }
          emptyDescription={
            search || statusFilter !== "ALL"
              ? "Try adjusting your search query or filter status."
              : "Create your first order to get started."
          }
          emptyAction={
            !search && statusFilter === "ALL" ? (
              <button
                type="button"
                onClick={() => router.push("/dashboard/orders/new")}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
              >
                + Create Order
              </button>
            ) : undefined
          }
          page={page}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          onPageChange={setPage}
          toolbarActions={null}
        />

        {/* Status Update Dialog */}
        <OrderStatusDialog
          isOpen={Boolean(orderToUpdateStatus)}
          order={orderToUpdateStatus}
          isUpdating={updateStatusMutation.isPending}
          onClose={() => {
            if (!updateStatusMutation.isPending) {
              setOrderToUpdateStatus(null);
            }
          }}
          onConfirm={handleConfirmStatusUpdate}
        />

        {/* Cancel Confirmation Dialog */}
        <OrderCancelDialog
          isOpen={Boolean(orderToCancel)}
          order={orderToCancel}
          isCancelling={cancelOrderMutation.isPending}
          onClose={() => {
            if (!cancelOrderMutation.isPending) {
              setOrderToCancel(null);
            }
          }}
          onConfirm={handleConfirmCancel}
        />
      </div>
    </DashboardLayout>
  );
}
