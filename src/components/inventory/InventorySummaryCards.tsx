"use client";

import {
  Package,
  Boxes,
  AlertTriangle,
  PackageX,
} from "lucide-react";

import type { InventorySummary } from "@/src/types/inventory.types";

interface InventorySummaryCardsProps {
  summary: InventorySummary;
  isLoading?: boolean;
}

export default function InventorySummaryCards({
  summary,
  isLoading = false,
}: InventorySummaryCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: summary.totalProducts,
      icon: Package,
      description: "Active products",
    },
    {
      title: "Total Stock Units",
      value: summary.totalStockUnits,
      icon: Boxes,
      description: "Units available",
    },
    {
      title: "Low Stock",
      value: summary.lowStockProducts,
      icon: AlertTriangle,
      description: "Products running low",
    },
    {
      title: "Out of Stock",
      value: summary.outOfStockProducts,
      icon: PackageX,
      description: "Products unavailable",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>

                {isLoading ? (
                  <div className="mt-3 h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                ) : (
                  <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value.toLocaleString("en-IN")}
                  </h3>
                )}

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {card.description}
                </p>
              </div>

              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}