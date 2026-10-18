"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import CreateOrderForm from "@/src/components/orders/CreateOrderForm";
import { useCreateOrder } from "@/src/hooks/useOrders";
import { useCustomers } from "@/src/hooks/useCustomers";
import { useProducts } from "@/src/hooks/useProducts";
import { getErrorMessage } from "@/src/lib/utils";
import type { CreateOrderInput } from "@/src/types/order.types";

export default function NewOrderPage() {
  const router = useRouter();

  const {
    data: customersData,
    isLoading: customersLoading,
    isError: customersError,
    refetch: refetchCustomers,
  } = useCustomers(1, 100);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useProducts(1, 100);

  const createOrder = useCreateOrder();

  async function handleCreateOrder(input: CreateOrderInput) {
    try {
      const order = await createOrder.mutateAsync(input);
      toast.success("Order created successfully!");
      router.push(`/dashboard/orders/${order.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create order."));
    }
  }

  const customers = customersData?.customers ?? [];
  const products = productsData?.products ?? [];

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl">
        {/* Back Link & Title */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400">
            <ShoppingBag size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Create New Order
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select customer, add products from inventory, and set tax or discount details.
            </p>
          </div>
        </div>

        {customersLoading || productsLoading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Loading customer and catalog inventory...
            </p>
          </div>
        ) : customersError || productsError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40"
          >
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              Unable to load customer or product directory.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Ensure your database is connected and records exist.
            </p>
            <button
              type="button"
              onClick={() => {
                if (customersError) void refetchCustomers();
                if (productsError) void refetchProducts();
              }}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <CreateOrderForm
            customers={customers}
            products={products}
            isSubmitting={createOrder.isPending}
            onSubmit={handleCreateOrder}
            onCancel={() => router.push("/dashboard/orders")}
          />
        )}
      </div>
    </DashboardLayout>
  );
}