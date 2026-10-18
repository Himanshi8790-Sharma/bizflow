"use client";

import { useRevenueTrend } from "@/src/hooks/useAnalytics";
import { formatCurrency } from "@/src/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function RevenueChart() {
  const { data, isPending, isError } = useRevenueTrend();

  const totalPeriodRevenue = (data ?? []).reduce(
    (acc, curr) => acc + (curr.revenue || 0),
    0
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              <TrendingUp size={12} />
              Last 30 Days
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Daily revenue progression from all non-cancelled orders
          </p>
        </div>

        {data && data.length > 0 && (
          <div className="rounded-xl bg-indigo-50/50 px-3.5 py-2 text-right dark:bg-indigo-950/20">
            <p className="text-xs text-indigo-600 dark:text-indigo-400">Period Total</p>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalPeriodRevenue)}
            </p>
          </div>
        )}
      </div>

      {isPending ? (
        <div className="flex h-72 items-center justify-center rounded-xl bg-gray-50/50 dark:bg-gray-800/40">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="text-xs text-gray-400">Loading revenue trend...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50/50 py-12 text-center dark:border-red-900/40 dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Failed to load revenue data.
          </p>
          <p className="mt-1 text-xs text-gray-500">Please try again later.</p>
        </div>
      ) : !data?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No revenue recorded yet
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Revenue trends will visualize as orders are placed.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#9CA3AF"
                opacity={0.15}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(value: string) =>
                  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                }
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />

              <YAxis
                tickFormatter={(value: number) => formatCurrency(value)}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                width={70}
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
                  formatCurrency(Number(value)),
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "var(--card, #ffffff)",
                  color: "var(--foreground, #0f172a)",
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#6366F1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366F1", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}