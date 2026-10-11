"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useRevenueTrend }  from "@/src/hooks/useAnalytics";

export default function RevenueChart() {
  const { data, isPending, isError } = useRevenueTrend();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revenue trend over the last 30 days
        </p>
      </div>

      {isPending ? (
        <div className="h-72 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      ) : isError ? (
        <p className="py-12 text-center text-sm text-red-500">
          Failed to load revenue data.
        </p>
      ) : !data?.length ? (
        <p className="py-12 text-center text-sm text-gray-500">
          No revenue data available yet.
        </p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#9CA3AF"
                opacity={0.2}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(value: string) =>
                  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                }
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
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
                labelFormatter={(value) =>
                  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                }
                formatter={(value) => [
                  `₹${(Number(value) / 100).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}`,
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#6366F1"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}