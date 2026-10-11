"use client";

import { useAnalyticsSummary } from "@/src/hooks/useAnalytics";


const cards = [
  { key: "totalRevenue", title: "Total Revenue" },
  { key: "totalOrders", title: "Total Orders" },
  { key: "totalCustomers", title: "Total Customers" },
  { key: "pendingOrders", title: "Pending Orders" },
] as const;

export default function SummaryCards() {
  const { data, isPending, isError, error } = useAnalyticsSummary();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        Failed to load analytics: {error.message}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const value = data[card.key];

        const formattedValue =
          card.key === "totalRevenue"
            ? `₹${(value / 100).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}`
            : value.toLocaleString("en-IN");

        return (
          <div
            key={card.key}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </p>

            <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {formattedValue}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Live data from your business
            </p>
          </div>
        );
      })}
    </div>
  );
}