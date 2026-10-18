"use client";

import { Plus, Package } from "lucide-react";

interface ProductsPageHeaderProps {
  totalProducts?: number;
  onAddProduct: () => void;
  canCreate?: boolean;
}

export default function ProductsPageHeader({
  totalProducts,
  onAddProduct,
  canCreate = true,
}: ProductsPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your catalog inventory, pricing in paise/rupees, and stock levels.
            </p>
          </div>
        </div>

        {typeof totalProducts === "number" && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalProducts}
            </span>{" "}
            {totalProducts === 1 ? "product item" : "product items"} in catalog
          </p>
        )}
      </div>

      {canCreate && (
        <button
          type="button"
          onClick={onAddProduct}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 sm:self-auto"
        >
          <Plus size={18} />
          Add Product
        </button>
      )}
    </div>
  );
}