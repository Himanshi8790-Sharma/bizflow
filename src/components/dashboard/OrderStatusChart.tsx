"use client";

import { useOrderStatus } from "@/src/hooks/useAnalytics";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F59E0B", // Amber
  CONFIRMED: "#3B82F6", // Blue
  PROCESSING: "#8B5CF6", // Purple
  COMPLETED: "#10B981", // Emerald
  CANCELLED: "#EF4444", // Red
};

export default function OrderStatusChart() {
  const { data, isPending, isError } = useOrderStatus();

  const totalOrders = (data ?? []).reduce(
    (acc, curr) => acc + (curr.count || 0),
    0
  );

  return (
    <section className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Status
              </h2>
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                <PieIcon size={12} />
                Fulfillment
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Distribution of orders by operational lifecycle stage
            </p>
          </div>

          {totalOrders > 0 && (
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {totalOrders} Total
            </span>
          )}
        </div>

        {isPending ? (
          <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50/50 dark:bg-gray-800/40">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-xs text-gray-400">Loading order distribution...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50/50 py-10 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load order status.
            </p>
            <p className="mt-1 text-xs text-gray-500">Please try refreshing.</p>
          </div>
        ) : !data?.length || data.every((item) => item.count === 0) ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center dark:border-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No orders available yet
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Orders will populate this status breakdown once created.
            </p>
          </div>
        ) : (
          <>
            <div className="relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.filter((item) => item.count > 0)}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {data
                      .filter((item) => item.count > 0)
                      .map((item) => (
                        <Cell
                          key={item.status}
                          fill={STATUS_COLORS[item.status] ?? "#94A3B8"}
                        />
                      ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [`${value} orders`, "Count"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "var(--card, #ffffff)",
                      color: "var(--foreground, #0f172a)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered label inside donut */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {totalOrders}
                </span>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Orders
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {data.map((item) => {
                const color = STATUS_COLORS[item.status] ?? "#94A3B8";
                const percentage =
                  totalOrders > 0
                    ? Math.round((item.count / totalOrders) * 100)
                    : 0;

                return (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-2 dark:border-gray-800 dark:bg-gray-800/40"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {item.count}
                      </span>
                      <span className="ml-1 text-[10px] text-gray-400">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}