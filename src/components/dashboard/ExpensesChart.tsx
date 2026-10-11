"use client";

import { useExpensesByCategory } from "@/src/hooks/useAnalytics";
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
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
  "#8B5CF6",
];

export default function ExpensesChart() {
  const { data, isPending, isError } = useExpensesByCategory();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Expenses by Category
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Understand where your business spends money
        </p>
      </div>

      {isPending ? (
        <div className="h-72 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      ) : isError ? (
        <p className="py-12 text-center text-sm text-red-500">
          Failed to load expenses.
        </p>
      ) : !data?.length ? (
        <p className="py-12 text-center text-sm text-gray-500">
          No expenses recorded yet.
        </p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#9CA3AF"
                opacity={0.2}
              />

              <XAxis
                dataKey="category"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickFormatter={(value: number) =>
                  `₹${(value / 100).toLocaleString("en-IN")}`
                }
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                width={65}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${(Number(value) / 100).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}`,
                  "Expenses",
                ]}
              />

              <Bar
                dataKey="total"
                name="Expenses"
                radius={[6, 6, 0, 0]}
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.category}
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