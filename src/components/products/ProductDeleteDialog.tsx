"use client";

import type { Product } from "@/src/types/product.types";
import { AlertTriangle, X } from "lucide-react";

interface ProductDeleteDialogProps {
  isOpen: boolean;
  product: Product | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (product: Product) => void;
}

export default function ProductDeleteDialog({
  isOpen,
  product,
  isDeleting,
  onClose,
  onConfirm,
}: ProductDeleteDialogProps) {
  if (!isOpen || !product) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-950"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>

          <div className="flex-1">
            <h2
              id="delete-product-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Delete Product
            </h2>

            <p
              id="delete-product-description"
              className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400"
            >
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {product.name}
              </span>
              ? This product will no longer appear in your active
              product list.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(product)}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}