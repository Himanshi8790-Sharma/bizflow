import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import ExpensesChart from "@/src/components/dashboard/ExpensesChart";
import OrderStatusChart from "@/src/components/dashboard/OrderStatusChart";
import RevenueChart from "@/src/components/dashboard/RevenueChart";
import SummaryCards from "@/src/components/dashboard/SummaryCards";
import TopProducts from "@/src/components/dashboard/TopProducts";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] min-w-0">
        {/* Page Heading */}
        <section className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold tracking-wider text-indigo-600 sm:text-sm dark:text-indigo-400">
            BUSINESS OVERVIEW
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">
            Welcome to BizFlow
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base dark:text-gray-400">
            Manage your business, monitor performance, and make informed
            decisions from one place.
          </p>
        </section>

        {/* Summary Cards */}
        <section className="mb-6 min-w-0 sm:mb-8">
          <SummaryCards />
        </section>

        {/* Revenue Chart */}
        <section className="mb-6 min-w-0 sm:mb-8">
          <RevenueChart />
        </section>

        {/* Products and Order Status */}
        <section className="mb-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 sm:mb-8">
          <div className="min-w-0">
            <TopProducts />
          </div>

          <div className="min-w-0">
            <OrderStatusChart />
          </div>
        </section>

        {/* Expenses Chart */}
        <section className="mb-6 min-w-0 sm:mb-8">
          <ExpensesChart />
        </section>
      </div>
    </DashboardLayout>
  );
}