"use client";

import { Plus, Package } from "lucide-react";

interface ProductsPageHeaderProps {
  onAddProduct: () => void;
}

export default function ProductsPageHeader({
  onAddProduct,
}: ProductsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Package size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your products, pricing, and stock levels.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddProduct}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus size={18} />
        Add Product
      </button>
    </div>
  );
}