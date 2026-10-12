"use client";

import { UserPlus, Users } from "lucide-react";

interface CustomersPageHeaderProps {
  totalCustomers?: number;
  onAddCustomer: () => void;
  canCreate?: boolean;
}

export default function CustomersPageHeader({
  totalCustomers,
  onAddCustomer,
  canCreate = true,
}: CustomersPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your customers and their contact information.
            </p>
          </div>
        </div>

        {typeof totalCustomers === "number" && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalCustomers}
            </span>{" "}
            {totalCustomers === 1 ? "customer" : "customers"} in total
          </p>
        )}
      </div>

      {canCreate && (
        <button
          type="button"
          onClick={onAddCustomer}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 sm:self-auto"
        >
          <UserPlus size={18} />
          Add Customer
        </button>
      )}
    </div>
  );
}