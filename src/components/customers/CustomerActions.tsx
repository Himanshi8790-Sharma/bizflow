"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Customer } from "@/src/types/customer.types";

interface CustomerActionsProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  canDelete?: boolean;
}

export default function CustomerActions({
  customer,
  onEdit,
  onDelete,
  canDelete = true,
}: CustomerActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onEdit(customer)}
        aria-label={`Edit ${customer.name}`}
        title="Edit customer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
      >
        <Pencil size={16} />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(customer)}
          aria-label={`Delete ${customer.name}`}
          title="Delete customer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}