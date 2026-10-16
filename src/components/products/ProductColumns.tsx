"use client";

import type { DataTableColumn } from "@/src/components/ui/data-table/DataTable";
import type { Product } from "@/src/types/product.types";

function formatCurrency(amountInPaise: number | null) {
  if (amountInPaise === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amountInPaise / 100);
}

export function getProductColumns(
  renderActions: (product: Product) => React.ReactNode,
): DataTableColumn<Product>[] {
  return [
    {
      id: "name",
      header: "Product",
      cell: (product) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {product.name}
          </p>

          {product.description && (
            <p className="mt-1 max-w-xs truncate text-xs text-gray-500 dark:text-gray-400">
              {product.description}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "sku",
      header: "SKU",
      cell: (product) => product.sku || "—",
    },
    {
      id: "price",
      header: "Selling Price",
      cell: (product) => (
        <span className="font-medium">
          {formatCurrency(product.price)}
        </span>
      ),
    },
    {
      id: "costPrice",
      header: "Cost Price",
      cell: (product) => formatCurrency(product.costPrice),
    },
    {
      id: "stock",
      header: "Stock",
      cell: (product) => {
        const isLowStock =
          product.stockQuantity <= product.lowStockLimit;

        return (
          <div>
            <span
              className={
                isLowStock
                  ? "font-semibold text-red-600 dark:text-red-400"
                  : "font-medium text-gray-700 dark:text-gray-300"
              }
            >
              {product.stockQuantity}
            </span>

            {isLowStock && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Low stock
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (product) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            product.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) => renderActions(product),
    },
  ];
}