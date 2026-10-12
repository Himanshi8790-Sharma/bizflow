import type { DataTableColumn } from "@/src/components/ui/data-table/DataTable";
import type { Customer } from "@/src/types/customer.types";
import CustomerActions from "./CustomerActions";

interface CustomerColumnsProps {
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  canDelete?: boolean;
}

export function getCustomerColumns({
  onEdit,
  onDelete,
  canDelete = true,
}: CustomerColumnsProps): DataTableColumn<Customer>[] {
  return [
    {
      id: "customer",
      header: "Customer",
      cell: (customer) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
            {customer.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900 dark:text-white">
              {customer.name}
            </p>

            <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
              {customer.email || "No email provided"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      accessor: (customer) => customer.phone || "—",
    },
    {
      id: "address",
      header: "Address",
      accessor: (customer) => (
        <span className="block max-w-xs truncate">
          {customer.address || "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (customer) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            customer.isActive
              ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {customer.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (customer) => (
        <CustomerActions
          customer={customer}
          onEdit={onEdit}
          onDelete={onDelete}
          canDelete={canDelete}
        />
      ),
    },
  ];
}