"use client";

import { useAnalyticsSummary } from "@/src/hooks/useAnalytics";
import { formatCurrency } from "@/src/lib/utils";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface CardConfig {
  key: "totalRevenue" | "totalOrders" | "totalCustomers" | "pendingOrders";
  title: string;
  icon: typeof IndianRupee;
  gradient: string;
  iconBg: string;
  iconColor: string;
  description: string;
}

const cards: CardConfig[] = [
  {
    key: "totalRevenue",
    title: "Total Revenue",
    icon: IndianRupee,
    gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    description: "Net realized revenue from confirmed orders",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    icon: ShoppingCart,
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    description: "All-time customer order transactions",
  },
  {
    key: "totalCustomers",
    title: "Total Customers",
    icon: Users,
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    description: "Active business accounts & clients",
  },
  {
    key: "pendingOrders",
    title: "Pending Orders",
    icon: Clock,
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    description: "Orders awaiting fulfillment or confirmation",
  },
];

export default function SummaryCards() {
  const { data, isPending, isError, error } = useAnalyticsSummary();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className="h-36 animate-pulse rounded-2xl border border-gray-200/80 bg-white/60 dark:border-gray-800 dark:bg-gray-900/60"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        <AlertCircle size={20} className="shrink-0" />
        <p>Failed to load analytics: {error?.message ?? "Please refresh."}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const rawValue = data ? data[card.key] : 0;
        const Icon = card.icon;

        const formattedValue =
          card.key === "totalRevenue"
            ? formatCurrency(rawValue)
            : rawValue.toLocaleString("en-IN");

        return (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            {/* Subtle corner glow */}
            <div
              className={`absolute right-0 top-0 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} opacity-50 blur-xl transition-opacity group-hover:opacity-80`}
            />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                  {formattedValue}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} shadow-xs transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon size={20} strokeWidth={2.2} />
              </div>
            </div>

            <p className="relative mt-3 text-xs text-gray-400 dark:text-gray-500">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}