"use client";

import { useEffect } from "react";
import { X, Users } from "lucide-react";

import CustomerForm from "./CustomerForm";
import { CreateCustomerInput, Customer } from "@/src/types/customer.types";


interface CustomerFormDialogProps {
  isOpen: boolean;
  customer?: Customer | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerInput) => void | Promise<void>;
}

export default function CustomerFormDialog({
  isOpen,
  customer = null,
  isSubmitting = false,
  onClose,
  onSubmit,
}: CustomerFormDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isEditMode = Boolean(customer);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-dialog-title"
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950"
      >
        {/* Dialog Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Users size={21} />
            </div>

            <div>
              <h2
                id="customer-dialog-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {isEditMode ? "Edit Customer" : "Add New Customer"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isEditMode
                  ? "Update the customer's information."
                  : "Enter the details to add a new customer."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dialog Form */}
        <div className="overflow-y-auto px-6 py-6">
          <CustomerForm
            key={customer?.id ?? "new-customer"}
            customer={customer}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </section>
    </div>
  );
}