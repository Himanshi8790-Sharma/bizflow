"use client";

import { ShoppingCart, Plus } from "lucide-react";
import Link from "next/link";

interface OrdersPageHeaderProps {
  totalOrders?: number;
  pendingOrders?: number;
  completedOrders?: number;
}

export default function OrdersPageHeader({
  totalOrders,
  pendingOrders,
  completedOrders,
}: OrdersPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400">
            <ShoppingCart size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Process customer orders, update statuses, and monitor fulfillment.
            </p>
          </div>
        </div>

        {typeof totalOrders === "number" && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalOrders}
            </span>{" "}
            total orders
            {typeof pendingOrders === "number" && (
              <>
                <span>•</span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                  {pendingOrders} Pending
                </span>
              </>
            )}
            {typeof completedOrders === "number" && (
              <>
                <span>•</span>
                <span className="rounded-md bg-green-50 px-2 py-0.5 font-medium text-green-700 dark:bg-green-950/30 dark:text-green-300">
                  {completedOrders} Completed
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <Link
        href="/dashboard/orders/new"
        className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 sm:self-auto"
      >
        <Plus size={18} />
        Create Order
      </Link>
    </div>
  );
}
