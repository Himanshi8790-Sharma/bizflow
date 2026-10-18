"use client";

import { useTopProducts } from "@/src/hooks/useAnalytics";
import { formatCurrency } from "@/src/lib/utils";
import { Package, TrendingUp } from "lucide-react";

export default function TopProducts() {
  const { data, isPending, isError } = useTopProducts();

  return (
    <section className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Products
              </h2>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <TrendingUp size={12} />
                Best Sellers
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Highest grossing products by sales volume
            </p>
          </div>
        </div>

        {isPending ? (
          <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50/50 dark:bg-gray-800/40">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-xs text-gray-400">Loading top products...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50/50 py-10 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load top products.
            </p>
            <p className="mt-1 text-xs text-gray-500">Please try refreshing the page.</p>
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center dark:border-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
              <Package size={20} />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              No product sales yet
            </p>
            <p className="mt-1 max-w-xs text-xs text-gray-500">
              Top-selling products will automatically appear here once orders are placed and processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
                  <th className="pb-3 pr-4"># Rank & Product</th>
                  <th className="pb-3 pr-4 text-right">Units Sold</th>
                  <th className="pb-3 text-right">Revenue</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {data.map((product, index) => {
                  const displayName =
                    product.productName || product.name || "Product";

                  return (
                    <tr
                      key={product.productId}
                      className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
                            {displayName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4 text-right font-medium text-gray-600 dark:text-gray-300">
                        {product.quantitySold.toLocaleString("en-IN")}
                      </td>

                      <td className="py-3.5 text-right font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}