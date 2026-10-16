"use client";

import type { Product } from "@/src/types/product.types";
import { Pencil, Trash2 } from "lucide-react";

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductActions({
  product,
  onEdit,
  onDelete,
}: ProductActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      {/* Edit Button */}
      <button
        type="button"
        onClick={() => onEdit(product)}
        title="Edit product"
        aria-label={`Edit ${product.name}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Pencil size={16} />
      </button>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => onDelete(product)}
        title="Delete product"
        aria-label={`Delete ${product.name}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}