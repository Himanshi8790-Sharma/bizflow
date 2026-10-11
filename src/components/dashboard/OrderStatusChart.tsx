"use client";

import { useOrderStatus } from "@/src/hooks/useAnalytics";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";


const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F59E0B",
  CONFIRMED: "#3B82F6",
  PROCESSING: "#8B5CF6",
  COMPLETED: "#10B981",
  CANCELLED: "#EF4444",
};

export default function OrderStatusChart() {
  const { data, isPending, isError } = useOrderStatus();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Order Status
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Distribution of orders by status
        </p>
      </div>

      {isPending ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      ) : isError ? (
        <p className="py-10 text-center text-sm text-red-500">
          Failed to load order status.
        </p>
      ) : !data?.length || data.every((item) => item.count === 0) ? (
        <p className="py-12 text-center text-sm text-gray-500">
          No orders available yet.
        </p>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.filter((item) => item.count > 0)}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
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

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {data.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[item.status] ?? "#94A3B8",
                  }}
                />

                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.status}
                </span>

                <span className="ml-auto text-sm font-semibold text-gray-900 dark:text-white">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}