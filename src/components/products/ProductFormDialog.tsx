"use client";

import ProductForm from "./ProductForm";

import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/src/types/product.types";

interface ProductFormDialogProps {
  isOpen: boolean;
  product?: Product | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateProductInput | UpdateProductInput,
  ) => void;
}

export default function ProductFormDialog({
  isOpen,
  product,
  isSubmitting,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-gray-950"
      >
        <div className="mb-6">
          <h2
            id="product-dialog-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            {product ? "Edit Product" : "Add New Product"}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {product
              ? "Update the product details below."
              : "Enter the details to add a product to your inventory."}
          </p>
        </div>

        <ProductForm
          key={product?.id ?? "new-product"}
          product={product}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}