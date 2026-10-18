"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DataTable from "@/src/components/ui/data-table/DataTable";

import CustomersPageHeader from "@/src/components/customers/CustomersPageHeader";
import CustomerFormDialog from "@/src/components/customers/CustomerFormDialog";
import CustomerDeleteDialog from "@/src/components/customers/CustomerDeleteDialog";
import { getCustomerColumns } from "@/src/components/customers/CustomerColumns";

import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/src/hooks/useCustomers";

import { useMe } from "@/src/hooks/useAuth";
import { getErrorMessage } from "@/src/lib/utils";

import type {
  Customer,
  CreateCustomerInput,
} from "@/src/types/customer.types";

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  const { data: me } = useMe();

  const { data, isLoading, isError, error, refetch } = useCustomers(
    page,
    PAGE_SIZE,
  );

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  /*
   * Search is performed on the customers loaded for the current page.
   * Server-side search can be added to the API later.
   */
  const filteredCustomers = useMemo(() => {
    const customers = data?.customers ?? [];
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return customers;
    }

    return customers.filter((customer) => {
      return [
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
      ].some((value) => value?.toLowerCase().includes(searchTerm));
    });
  }, [data?.customers, search]);

  const user = me as
    | {
        role?: string;
        user?: { role?: string };
        data?: { role?: string };
      }
    | undefined;

  const role = user?.role ?? user?.user?.role ?? user?.data?.role;

  const canCreate = role
    ? ["ADMIN", "MANAGER"].includes(role)
    : false;

  const canEdit = canCreate;
  const canDelete = role === "ADMIN";

  function handleAddCustomer() {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  }

  function handleEditCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    setIsFormOpen(false);
    setSelectedCustomer(null);
  }

  async function handleSubmitCustomer(input: CreateCustomerInput) {
    try {
      if (selectedCustomer) {
        await updateMutation.mutateAsync({
          id: selectedCustomer.id,
          data: input,
        });

        toast.success("Customer updated successfully.");
      } else {
        await createMutation.mutateAsync(input);

        toast.success("Customer created successfully.");
      }

      setIsFormOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Customer save failed:", error);
      toast.error(getErrorMessage(error, "Failed to save customer."));
    }
  }

  async function handleDeleteCustomer() {
    if (!customerToDelete) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(customerToDelete.id);

      toast.success("Customer deleted successfully.");
      setCustomerToDelete(null);

      // If the last record on a page was deleted, move to the previous page.
      if (
        data?.customers.length === 1 &&
        page > 1
      ) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch (error) {
      console.error("Customer deletion failed:", error);
      toast.error(getErrorMessage(error, "Failed to delete customer."));
    }
  }

  const columns = useMemo(
    () =>
      getCustomerColumns({
        onEdit: handleEditCustomer,
        onDelete: setCustomerToDelete,
        canDelete,
      }).map((column) => {
        if (column.id === "actions" && !canEdit) {
          return {
            ...column,
            cell: () => (
              <span className="text-gray-400">View only</span>
            ),
          };
        }

        return column;
      }),
    [canDelete, canEdit],
  );

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl">
        <CustomersPageHeader
          totalCustomers={data?.pagination.total}
          onAddCustomer={handleAddCustomer}
          canCreate={canCreate}
        />

        {!canCreate && role && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
            You have view-only access to customers.
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredCustomers}
          getRowId={(customer) => customer.id}
          isLoading={isLoading}
          isError={isError}
          errorMessage={getErrorMessage(
            error,
            "Unable to load customers. Please try again.",
          )}
          onRetry={() => void refetch()}
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Search customers..."
          emptyTitle={search ? "No matching customers" : "No customers yet"}
          emptyDescription={
            search
              ? "Try a different name, email, phone number, or address."
              : "Add your first customer to get started."
          }
          emptyAction={
            !search && canCreate ? (
              <button
                type="button"
                onClick={handleAddCustomer}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Add Customer
              </button>
            ) : undefined
          }
          page={data?.pagination.page ?? page}
          totalPages={data?.pagination.totalPages ?? 1}
          totalItems={data?.pagination.total}
          onPageChange={setPage}
          toolbarActions={null}
        />

        <CustomerFormDialog
          isOpen={isFormOpen}
          customer={selectedCustomer}
          isSubmitting={
            createMutation.isPending || updateMutation.isPending
          }
          onClose={handleCloseForm}
          onSubmit={handleSubmitCustomer}
        />

        <CustomerDeleteDialog
          isOpen={Boolean(customerToDelete)}
          customer={customerToDelete}
          isDeleting={deleteMutation.isPending}
          onClose={() => {
            if (!deleteMutation.isPending) {
              setCustomerToDelete(null);
            }
          }}
          onConfirm={handleDeleteCustomer}
        />
      </div>
    </DashboardLayout>
  );
}
