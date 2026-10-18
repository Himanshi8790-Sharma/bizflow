"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  User,
  ShoppingBag,
  Receipt,
  FileText,
  Printer,
  RefreshCw,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import OrderStatusBadge from "@/src/components/orders/OrderStatusBadge";
import OrderStatusDialog from "@/src/components/orders/OrderStatusDialog";
import OrderCancelDialog from "@/src/components/orders/OrderCancelDialog";
import {
  useOrder,
  useUpdateOrderStatus,
  useCancelOrder,
} from "@/src/hooks/useOrders";
import { useMe } from "@/src/hooks/useAuth";
import { formatCurrency, formatDateTime, getErrorMessage } from "@/src/lib/utils";
import type { Order, UpdatableOrderStatus } from "@/src/types/order.types";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const { data: me } = useMe();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id);
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

  async function handleConfirmStatusUpdate(
    _: Order,
    newStatus: UpdatableOrderStatus
  ) {
    if (!order) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: order.id,
        data: { status: newStatus },
      });
      toast.success(`Order status updated to ${newStatus}`);
      setIsStatusDialogOpen(false);
      void refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update order status"));
    }
  }

  async function handleConfirmCancel() {
    if (!order) return;
    try {
      await cancelOrderMutation.mutateAsync(order.id);
      toast.success("Order cancelled and inventory restored");
      setIsCancelDialogOpen(false);
      void refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to cancel order"));
    }
  }

  const isFinalStatus =
    order?.status === "COMPLETED" || order?.status === "CANCELLED";

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>

          {order && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Printer size={15} />
                Print Invoice
              </button>

              {canManage && !isFinalStatus && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsStatusDialogOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-2xs transition hover:bg-indigo-100/60 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    <RefreshCw size={15} />
                    Update Status
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCancelDialogOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-semibold text-red-600 shadow-2xs transition hover:bg-red-100/60 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                  >
                    <XCircle size={15} />
                    Cancel Order
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Loading order details...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40"
          >
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              {getErrorMessage(error, "Unable to load this order.")}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loaded Order Overview */}
        {order && (
          <div className="space-y-6">
            {/* Top Order Badge Header */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                    {order.orderNumber || `#${order.id.slice(0, 8)}`}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    Placed on {formatDateTime(order.createdAt)}
                  </span>
                  <span>•</span>
                  <span>ID: {order.id}</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Order Total
                </span>
                <p className="text-2xl font-extrabold text-indigo-600 sm:text-3xl dark:text-indigo-400">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>

            {/* Grid: Customer Details & Payment Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Customer Info Card */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 mb-3">
                  <User size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Customer Details
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {order.customer?.name ?? "Walk-in Customer"}
                  </p>
                  {order.customer?.id && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Account ID: {order.customer.id}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment & Fulfillment Summary */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Fulfillment Status
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Order Lifecycle:</span>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Payment Status:</span>
                    <OrderStatusBadge status={order.paymentStatus} />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table Card */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs sm:p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Purchased Items ({order.items?.length ?? 0})
                </h3>
              </div>

              {!order.items?.length ? (
                <p className="py-8 text-center text-xs text-gray-400">
                  No line items found for this order.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
                        <th className="pb-3 pr-4">Product</th>
                        <th className="px-4 pb-3 text-center">Quantity</th>
                        <th className="px-4 pb-3 text-right">Unit Price</th>
                        <th className="pb-3 pl-4 text-right">Subtotal</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                      {order.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                          <td className="py-3.5 pr-4">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {item.productName || "Product"}
                            </p>
                            <p className="font-mono text-[10px] text-gray-400">
                              {item.productId}
                            </p>
                          </td>

                          <td className="px-4 py-3.5 text-center font-medium text-gray-700 dark:text-gray-300">
                            {item.quantity}
                          </td>

                          <td className="px-4 py-3.5 text-right font-medium text-gray-600 dark:text-gray-300">
                            {formatCurrency(item.unitPrice)}
                          </td>

                          <td className="py-3.5 pl-4 text-right font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Order Financial Totals */}
              <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800">
                {/* Notes Column */}
                <div className="max-w-md">
                  {order.notes ? (
                    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-800/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <FileText size={14} />
                        Order Notes
                      </div>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed dark:text-gray-400">
                        {order.notes}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No additional order notes.</p>
                  )}
                </div>

                {/* Subtotals Breakdown */}
                <div className="w-full sm:w-72 space-y-2 text-xs">
                  {typeof order.subtotal === "number" && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Items Subtotal:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </div>
                  )}

                  {typeof order.taxAmount === "number" && order.taxAmount > 0 && (
                    <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
                      <span>Tax (GST/VAT):</span>
                      <span className="font-semibold">+{formatCurrency(order.taxAmount)}</span>
                    </div>
                  )}

                  {typeof order.discountAmount === "number" && order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount:</span>
                      <span className="font-semibold">-{formatCurrency(order.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900 dark:border-gray-800 dark:text-white">
                    <span>Total Amount:</span>
                    <span className="text-base text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Dialog */}
        <OrderStatusDialog
          isOpen={isStatusDialogOpen}
          order={order ?? null}
          isUpdating={updateStatusMutation.isPending}
          onClose={() => setIsStatusDialogOpen(false)}
          onConfirm={handleConfirmStatusUpdate}
        />

        {/* Cancel Confirmation Dialog */}
        <OrderCancelDialog
          isOpen={isCancelDialogOpen}
          order={order ?? null}
          isCancelling={cancelOrderMutation.isPending}
          onClose={() => setIsCancelDialogOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      </div>
    </DashboardLayout>
  );
}