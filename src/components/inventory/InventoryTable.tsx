"use client";

import type { InventoryProduct } from "@/src/types/inventory.types";

interface InventoryTableProps {
  products: InventoryProduct[];
  isLoading?: boolean;
}

export default function InventoryTable({
  products,
  isLoading = false,
}: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                Product
              </th>

              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                SKU
              </th>

              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                Available Stock
              </th>

              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                Low Stock Limit
              </th>

              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No inventory products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isOutOfStock = product.stockQuantity === 0;
                const isLowStock =
                  product.stockQuantity <= product.lowStockLimit;

                const status = isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                    ? "Low Stock"
                    : "In Stock";

                const statusClasses = isOutOfStock
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : isLowStock
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

                return (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {product.sku || "—"}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {product.stockQuantity.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {product.lowStockLimit.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}