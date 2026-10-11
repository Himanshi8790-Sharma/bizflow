"use client";

import { useTopProducts } from "@/src/hooks/useAnalytics";

export default function TopProducts() {
  const { data, isPending, isError } = useTopProducts();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top Products
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your best-performing products
        </p>
      </div>

      {isPending ? (
        <div className="h-48 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      ) : isError ? (
        <p className="py-10 text-center text-sm text-red-500">
          Failed to load top products.
        </p>
      ) : !data?.length ? (
        <div className="py-10 text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No product sales yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Top-selling products will appear here once orders are completed.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
                <th className="pb-3 pr-4 font-medium">Product</th>
                <th className="pb-3 pr-4 text-right font-medium">
                  Units Sold
                </th>
                <th className="pb-3 text-right font-medium">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {data.map((product) => (
                <tr
                  key={product.productId}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                >
                  <td className="py-4 pr-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </span>
                  </td>

                  <td className="py-4 pr-4 text-right text-gray-600 dark:text-gray-300">
                    {product.quantitySold.toLocaleString("en-IN")}
                  </td>

                  <td className="py-4 text-right font-medium text-gray-900 dark:text-white">
                    ₹
                    {(product.revenue / 100).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}