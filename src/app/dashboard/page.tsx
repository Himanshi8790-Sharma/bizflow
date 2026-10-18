import Link from "next/link";
import { Plus, ShoppingCart, Package, Users, Sparkles } from "lucide-react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import ExpensesChart from "@/src/components/dashboard/ExpensesChart";
import OrderStatusChart from "@/src/components/dashboard/OrderStatusChart";
import RevenueChart from "@/src/components/dashboard/RevenueChart";
import SummaryCards from "@/src/components/dashboard/SummaryCards";
import TopProducts from "@/src/components/dashboard/TopProducts";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-8">
        {/* Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/50 p-6 shadow-xs backdrop-blur-md sm:p-8 dark:border-indigo-950/40 dark:from-indigo-950/30 dark:via-gray-900 dark:to-purple-950/20">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-2xs dark:bg-indigo-500/20 dark:text-indigo-300">
                <Sparkles size={13} />
                <span>Unified Enterprise Overview</span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">
                Welcome back to BizFlow
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
                Real-time insights on your revenue pipeline, order fulfillment, product stock, and operational cost centers.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/dashboard/orders/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus size={16} />
                <span>New Order</span>
              </Link>

              <Link
                href="/dashboard/products"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
              >
                <Package size={16} className="text-gray-400" />
                <span>Catalog</span>
              </Link>

              <Link
                href="/dashboard/customers"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
              >
                <Users size={16} className="text-gray-400" />
                <span>Customers</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Live Summary KPI Cards */}
        <section className="min-w-0">
          <SummaryCards />
        </section>

        {/* Revenue Analytics Chart */}
        <section className="min-w-0">
          <RevenueChart />
        </section>

        {/* Top Products and Order Status Breakdown */}
        <section className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <TopProducts />
          </div>

          <div className="min-w-0">
            <OrderStatusChart />
          </div>
        </section>

        {/* Operational Expenses Breakdown */}
        <section className="min-w-0">
          <ExpensesChart />
        </section>
      </div>
    </DashboardLayout>
  );
}