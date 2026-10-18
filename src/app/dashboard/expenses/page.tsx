"use client";

import { Receipt, DollarSign, TrendingDown, PieChart } from "lucide-react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import ExpensesChart from "@/src/components/dashboard/ExpensesChart";
import { useExpensesByCategory } from "@/src/hooks/useAnalytics";
import { formatCurrency, getErrorMessage } from "@/src/lib/utils";

const CATEGORY_COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
  "#8B5CF6",
  "#3B82F6",
  "#F97316",
];

export default function ExpensesPage() {
  const { data, isPending, isError, error, refetch } = useExpensesByCategory();

  const expenses = (data ?? []).map((item) => ({
    category: item.category || "Uncategorized Operations",
    amount: item.amount ?? item.total ?? 0,
  }));

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400">
              <Receipt size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                Expenses & Expenditure
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track operational costs, analyze business spending, and manage budget allocations.
              </p>
            </div>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Recorded Expenses
            </p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="mt-1 text-xs text-gray-500">All recorded operational spend</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Expense Categories
            </p>
            <p className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {expenses.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">Active expense segments</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Primary Cost Center
            </p>
            <p className="mt-2 truncate text-xl font-bold text-gray-900 dark:text-white">
              {expenses.length > 0
                ? [...expenses].sort((a, b) => b.amount - a.amount)[0]?.category
                : "None recorded"}
            </p>
            <p className="mt-1 text-xs text-gray-500">Highest allocation segment</p>
          </div>
        </div>

        {/* Visual Chart */}
        <div className="mb-8">
          <ExpensesChart />
        </div>

        {/* Detailed Breakdown List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Category Allocations
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Detailed breakdown and percentage share of total spending
              </p>
            </div>
          </div>

          {isPending ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-900 dark:bg-red-950/20">
              <p className="text-sm text-red-600 dark:text-red-400">
                {getErrorMessage(error, "Failed to load category breakdown.")}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-2 text-xs font-semibold text-red-700 underline"
              >
                Retry
              </button>
            </div>
          ) : expenses.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                No expense entries currently recorded.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Logged operational expenses will automatically compute your breakdown here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((item, idx) => {
                const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                const pct =
                  totalExpenses > 0
                    ? Math.round((item.amount / totalExpenses) * 100)
                    : 0;

                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {pct}%
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
