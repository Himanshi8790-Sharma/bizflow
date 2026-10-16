"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/src/types/product.types";

const productSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  sku: z.string().trim(),
  description: z.string().trim(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  costPrice: z.union([
    z.literal(""),
    z.coerce.number().min(0, "Cost price cannot be negative"),
  ]),
  stockQuantity: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  lowStockLimit: z.coerce
    .number()
    .int("Low stock limit must be a whole number")
    .min(0, "Low stock limit cannot be negative"),
});

type ProductFormValues = z.input<typeof productSchema>;
type ValidatedProductFormValues = z.output<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  isSubmitting: boolean;
  onSubmit: (
    data: CreateProductInput | UpdateProductInput,
  ) => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProductFormProps) {
const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<
  ProductFormValues,
  undefined,
  ValidatedProductFormValues
>({
  resolver: zodResolver(productSchema),
  defaultValues: {
    name: "",
    sku: "",
    description: "",
    price: 0,
    costPrice: "",
    stockQuantity: 0,
    lowStockLimit: 5,
  },
});

  useEffect(() => {
    reset({
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      description: product?.description ?? "",
      price: product ? product.price / 100 : 0,
      costPrice:
        product?.costPrice != null
          ? product.costPrice / 100
          : "",
      stockQuantity: product?.stockQuantity ?? 0,
      lowStockLimit: product?.lowStockLimit ?? 5,
    });
  }, [product, reset]);

const submitForm = (values: ValidatedProductFormValues) => {
        const data = {
      name: values.name,
      sku: values.sku || null,
      description: values.description || null,
      price: Math.round(values.price * 100),
      costPrice:
        values.costPrice === ""
          ? null
          : Math.round(Number(values.costPrice) * 100),
      stockQuantity: values.stockQuantity,
      lowStockLimit: values.lowStockLimit,
    };

    onSubmit(data);
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";

  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Product Name *
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Enter product name"
          className={inputClass}
        />
        {errors.name && (
          <p className={errorClass}>{errors.name.message}</p>
        )}
      </div>

      {/* SKU */}
      <div>
        <label htmlFor="sku" className={labelClass}>
          SKU
        </label>
        <input
          id="sku"
          {...register("sku")}
          placeholder="e.g. PROD-001"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          placeholder="Enter product description"
          className={inputClass}
        />
      </div>

      {/* Selling Price */}
      <div>
        <label htmlFor="price" className={labelClass}>
          Selling Price (₹) *
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0.01"
          {...register("price")}
          className={inputClass}
        />
        {errors.price && (
          <p className={errorClass}>{errors.price.message}</p>
        )}
      </div>

      {/* Cost Price */}
      <div>
        <label htmlFor="costPrice" className={labelClass}>
          Cost Price (₹)
        </label>
        <input
          id="costPrice"
          type="number"
          step="0.01"
          min="0"
          {...register("costPrice")}
          placeholder="Optional"
          className={inputClass}
        />
        {errors.costPrice && (
          <p className={errorClass}>{errors.costPrice.message}</p>
        )}
      </div>

      {/* Stock Quantity */}
      <div>
        <label htmlFor="stockQuantity" className={labelClass}>
          Stock Quantity *
        </label>
        <input
          id="stockQuantity"
          type="number"
          min="0"
          step="1"
          {...register("stockQuantity")}
          className={inputClass}
        />
        {errors.stockQuantity && (
          <p className={errorClass}>
            {errors.stockQuantity.message}
          </p>
        )}
      </div>

      {/* Low Stock Limit */}
      <div>
        <label htmlFor="lowStockLimit" className={labelClass}>
          Low Stock Alert Limit *
        </label>
        <input
          id="lowStockLimit"
          type="number"
          min="0"
          step="1"
          {...register("lowStockLimit")}
          className={inputClass}
        />
        {errors.lowStockLimit && (
          <p className={errorClass}>
            {errors.lowStockLimit.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}