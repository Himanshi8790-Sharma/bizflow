"use client";

import { useExpensesByCategory } from "@/src/hooks/useAnalytics";
import { formatCurrency } from "@/src/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
  "#F97316", // Orange
];

export default function ExpensesChart() {
  const { data, isPending, isError } = useExpensesByCategory();

  const chartData = (data ?? []).map((item) => ({
    category: item.category || "Uncategorized",
    amount: item.amount ?? item.total ?? 0,
  }));

  const totalExpenses = chartData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Expenses by Category
            </h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              Breakdown
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track business expenditure distribution across operational categories
          </p>
        </div>

        {chartData.length > 0 && (
          <div className="rounded-xl bg-gray-50 px-3.5 py-2 text-right dark:bg-gray-800/60">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Recorded Expenses</p>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        )}
      </div>

      {isPending ? (
        <div className="flex h-72 items-center justify-center rounded-xl bg-gray-50/50 dark:bg-gray-800/40">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="text-xs text-gray-400">Loading expense data...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50/50 py-10 text-center dark:border-red-900/40 dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Failed to load expense records.
          </p>
          <p className="mt-1 text-xs text-gray-500">Please try refreshing the page.</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No expenses recorded yet
          </p>
          <p className="mt-1 max-w-sm text-xs text-gray-500">
            Expense data recorded in your organization will be automatically categorized here.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#9CA3AF"
                opacity={0.15}
              />

              <XAxis
                dataKey="category"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickFormatter={(value: number) => formatCurrency(value)}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                width={70}
              />

              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Expenses",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "var(--card, #ffffff)",
                  color: "var(--foreground, #0f172a)",
                }}
              />

              <Bar
                dataKey="amount"
                name="Expenses"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              >
                {chartData.map((item, index) => (
                  <Cell
                    key={`cell-${item.category}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}