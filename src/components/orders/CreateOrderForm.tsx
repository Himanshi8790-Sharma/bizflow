"use client";

import { useMemo, useState } from "react";
import type { Customer } from "@/src/types/customer.types";
import type { Product } from "@/src/types/product.types";
import type { CreateOrderInput } from "@/src/types/order.types";
import { formatCurrency } from "@/src/lib/utils";
import { Plus, Trash2, ShoppingBag, Receipt, AlertCircle } from "lucide-react";

interface CreateOrderFormProps {
  customers: Customer[];
  products: Product[];
  isSubmitting: boolean;
  onSubmit: (data: CreateOrderInput) => Promise<void>;
  onCancel: () => void;
}

interface SelectedProduct {
  productId: string;
  quantity: number;
}

export default function CreateOrderForm({
  customers,
  products,
  isSubmitting,
  onSubmit,
  onCancel,
}: CreateOrderFormProps) {
  const [customerId, setCustomerId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [taxRupees, setTaxRupees] = useState<string>("0");
  const [discountRupees, setDiscountRupees] = useState<string>("0");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  const activeProducts = products.filter(
    (product) => product.isActive && !product.deletedAt
  );
  const activeCustomers = customers.filter(
    (customer) => customer.isActive && !customer.deletedAt
  );

  const orderLines = useMemo(() => {
    return selectedProducts.map((item) => {
      const product = activeProducts.find((p) => p.id === item.productId);
      const unitPrice = product?.price ?? 0;
      const subtotal = unitPrice * item.quantity;

      return {
        ...item,
        product,
        unitPrice,
        subtotal,
      };
    });
  }, [selectedProducts, activeProducts]);

  const subtotalPaise = orderLines.reduce((acc, line) => acc + line.subtotal, 0);
  const taxPaise = Math.max(0, Math.round((Number(taxRupees) || 0) * 100));
  const discountPaise = Math.max(0, Math.round((Number(discountRupees) || 0) * 100));
  const totalAmountPaise = Math.max(0, subtotalPaise + taxPaise - discountPaise);

  function handleAddProductLine() {
    const nextProduct = activeProducts.find(
      (p) =>
        p.stockQuantity > 0 &&
        !selectedProducts.some((item) => item.productId === p.id)
    );

    if (!nextProduct) {
      setFormError("No additional products with available stock can be added.");
      return;
    }

    setFormError("");
    setSelectedProducts((prev) => [
      ...prev,
      {
        productId: nextProduct.id,
        quantity: 1,
      },
    ]);
  }

  function handleUpdateLine(
    index: number,
    field: "productId" | "quantity",
    val: string
  ) {
    setFormError("");
    setSelectedProducts((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        if (field === "productId") {
          return {
            ...item,
            productId: val,
            quantity: 1,
          };
        }

        const qty = Math.max(1, parseInt(val, 10) || 1);
        return {
          ...item,
          quantity: qty,
        };
      })
    );
  }

  function handleRemoveLine(index: number) {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    if (!customerId) {
      setFormError("Please select a customer for this order.");
      return;
    }

    if (selectedProducts.length === 0) {
      setFormError("Please add at least one product item to the order.");
      return;
    }

    for (const item of selectedProducts) {
      const product = activeProducts.find((p) => p.id === item.productId);
      if (!product) {
        setFormError("Invalid product selected.");
        return;
      }
      if (item.quantity > product.stockQuantity) {
        setFormError(
          `Insufficient stock: ${product.name} has only ${product.stockQuantity} units available.`
        );
        return;
      }
    }

    try {
      await onSubmit({
        customerId,
        items: selectedProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
        taxAmount: taxPaise,
        discountAmount: discountPaise,
        notes: notes.trim() || undefined,
      });
    } catch {
      // Handled by parent
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 animate-fade-in-rise dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* 1. Customer Selection Card */}
      <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <label
          htmlFor="order-customer"
          className="block text-sm font-semibold text-gray-900 dark:text-white"
        >
          Customer Account <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Select an existing customer from your directory or create a new one first.
        </p>

        <div className="mt-3">
          <select
            id="order-customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">Select a customer...</option>
            {activeCustomers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name} {cust.email ? `(${cust.email})` : ""}
              </option>
            ))}
          </select>
        </div>

        {activeCustomers.length === 0 && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            No active customers found. Please add a customer under CRM first.
          </p>
        )}
      </section>

      {/* 2. Order Line Items Card */}
      <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Order Items <span className="text-red-500">*</span>
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Add catalog products and configure quantities.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddProductLine}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-indigo-200 bg-indigo-50/50 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-2xs transition hover:bg-indigo-100/60 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <Plus size={15} />
            <span>Add Item</span>
          </button>
        </div>

        {selectedProducts.length === 0 ? (
          <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
              <ShoppingBag size={20} />
            </div>
            <p className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              No products selected
            </p>
            <p className="text-[11px] text-gray-400">
              Click &quot;Add Item&quot; to pick products and specify units.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {orderLines.map((line, idx) => (
              <div
                key={`line-${idx}`}
                className="grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 sm:grid-cols-12 sm:items-center dark:border-gray-800 dark:bg-gray-850/50"
              >
                {/* Product Selection */}
                <div className="sm:col-span-5">
                  <label
                    htmlFor={`item-select-${idx}`}
                    className="mb-1 block text-[11px] font-semibold text-gray-500 dark:text-gray-400"
                  >
                    Product
                  </label>
                  <select
                    id={`item-select-${idx}`}
                    value={line.productId}
                    onChange={(e) =>
                      handleUpdateLine(idx, "productId", e.target.value)
                    }
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    {activeProducts.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        disabled={
                          p.stockQuantity <= 0 && p.id !== line.productId
                        }
                      >
                        {p.name} ({formatCurrency(p.price)}) · Stock:{" "}
                        {p.stockQuantity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`item-qty-${idx}`}
                    className="mb-1 block text-[11px] font-semibold text-gray-500 dark:text-gray-400"
                  >
                    Qty
                  </label>
                  <input
                    id={`item-qty-${idx}`}
                    type="number"
                    min={1}
                    max={line.product?.stockQuantity || 1}
                    value={line.quantity}
                    onChange={(e) =>
                      handleUpdateLine(idx, "quantity", e.target.value)
                    }
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                {/* Line Subtotal */}
                <div className="sm:col-span-3">
                  <p className="mb-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    Subtotal
                  </p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {formatCurrency(line.subtotal)}
                  </p>
                </div>

                {/* Remove button */}
                <div className="flex sm:col-span-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    disabled={isSubmitting}
                    aria-label={`Remove ${line.product?.name || "item"}`}
                    className="inline-flex items-center gap-1 rounded-lg p-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={14} />
                    <span className="sm:hidden">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Additional Financials (Tax, Discount, Notes) */}
      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <label
            htmlFor="tax-input"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
          >
            Tax Amount (₹)
          </label>
          <input
            id="tax-input"
            type="number"
            min={0}
            step="0.01"
            value={taxRupees}
            onChange={(e) => setTaxRupees(e.target.value)}
            disabled={isSubmitting}
            placeholder="0.00"
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="discount-input"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
          >
            Discount Amount (₹)
          </label>
          <input
            id="discount-input"
            type="number"
            min={0}
            step="0.01"
            value={discountRupees}
            onChange={(e) => setDiscountRupees(e.target.value)}
            disabled={isSubmitting}
            placeholder="0.00"
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="order-notes"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
          >
            Order Notes (Optional)
          </label>
          <textarea
            id="order-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
            placeholder="Special delivery instructions, client reference, or remarks..."
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </section>

      {/* 4. Financial Summary Card */}
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-xs dark:border-indigo-950/40 dark:from-indigo-950/20 dark:to-gray-900">
        <div className="flex items-center gap-2 mb-3">
          <Receipt size={17} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Order Calculation Summary
          </h3>
        </div>

        <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Items Subtotal:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(subtotalPaise)}
            </span>
          </div>

          {taxPaise > 0 && (
            <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
              <span>Tax (GST/VAT):</span>
              <span className="font-semibold">+{formatCurrency(taxPaise)}</span>
            </div>
          )}

          {discountPaise > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Applied Discount:</span>
              <span className="font-semibold">-{formatCurrency(discountPaise)}</span>
            </div>
          )}

          <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900 dark:border-gray-800 dark:text-white">
            <span>Final Total:</span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {formatCurrency(totalAmountPaise)}
            </span>
          </div>
        </div>
      </section>

      {/* Form Action Buttons */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !customerId ||
            selectedProducts.length === 0
          }
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating Order..." : "Confirm & Place Order"}
        </button>
      </div>
    </form>
  );
}