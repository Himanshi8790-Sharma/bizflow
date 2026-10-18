"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DataTable from "@/src/components/ui/data-table/DataTable";

import ProductsPageHeader from "@/src/components/products/ProductsPageHeader";
import ProductFormDialog from "@/src/components/products/ProductFormDialog";
import ProductDeleteDialog from "@/src/components/products/ProductDeleteDialog";
import { getProductColumns } from "@/src/components/products/ProductColumns";
import ProductActions from "@/src/components/products/ProductActions";
import { getErrorMessage } from "@/src/lib/utils";

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/src/hooks/useProducts";

import { useMe } from "@/src/hooks/useAuth";

import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/src/types/product.types";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

  const { data: me } = useMe();

  const { data, isLoading, isError, error, refetch } = useProducts(
    page,
    PAGE_SIZE,
  );

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Search within the products loaded on the current page.
  const filteredProducts = useMemo(() => {
    const products = data?.products ?? [];
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.sku,
        product.description,
      ].some((value) => value?.toLowerCase().includes(searchTerm)),
    );
  }, [data?.products, search]);

  // Resolve the logged-in user's role.
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

  function handleAddProduct() {
    setSelectedProduct(null);
    setIsFormOpen(true);
  }

  function handleEditProduct(product: Product) {
    setSelectedProduct(product);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    setIsFormOpen(false);
    setSelectedProduct(null);
  }

  async function handleSubmitProduct(
    input: CreateProductInput | UpdateProductInput,
  ) {
    try {
      if (selectedProduct) {
        await updateMutation.mutateAsync({
          id: selectedProduct.id,
          data: input as UpdateProductInput,
        });

        toast.success("Product updated successfully.");
      } else {
        await createMutation.mutateAsync(
          input as CreateProductInput,
        );

        toast.success("Product created successfully.");
      }

      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Product save failed:", error);

      toast.error(
        getErrorMessage(error, "Failed to save product."),
      );
    }
  }

  async function handleDeleteProduct() {
    if (!productToDelete) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(productToDelete.id);

      toast.success("Product deleted successfully.");
      setProductToDelete(null);

      // Move back if the deleted product was the last record on this page.
      if (data?.products.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch (error) {
      console.error("Product deletion failed:", error);

      toast.error(
        getErrorMessage(error, "Failed to delete product."),
      );
    }
  }

  const columns = useMemo(
    () =>
      getProductColumns((product) => (
        <ProductActions
          product={product}
          onEdit={handleEditProduct}
          onDelete={setProductToDelete}
        />
      )).map((column) => {
        if (column.id === "actions" && !canEdit && !canDelete) {
          return {
            ...column,
            cell: () => (
              <span className="text-gray-400">View only</span>
            ),
          };
        }

        if (column.id === "actions" && !canEdit && canDelete) {
          return {
            ...column,
            cell: (product: Product) => (
              <ProductActions
                product={product}
                onEdit={() => {}}
                onDelete={setProductToDelete}
              />
            ),
          };
        }

        if (column.id === "actions" && canEdit && !canDelete) {
          return {
            ...column,
            cell: (product: Product) => (
              <ProductActions
                product={product}
                onEdit={handleEditProduct}
                onDelete={() => {}}
              />
            ),
          };
        }

        return column;
      }),
    [canEdit, canDelete],
  );

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl">
        <ProductsPageHeader
          totalProducts={data?.pagination.total}
          onAddProduct={handleAddProduct}
          canCreate={canCreate}
        />

        {!canCreate && role && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
            You have view-only access to creating and editing products.
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredProducts}
          getRowId={(product) => product.id}
          isLoading={isLoading}
          isError={isError}
          errorMessage={getErrorMessage(
            error,
            "Unable to load products. Please try again.",
          )}
          onRetry={() => void refetch()}
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Search products..."
          emptyTitle={
            search ? "No matching products" : "No products yet"
          }
          emptyDescription={
            search
              ? "Try another product name, SKU, or description."
              : "Add your first product to get started."
          }
          emptyAction={
            !search && canCreate ? (
              <button
                type="button"
                onClick={handleAddProduct}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add Product
              </button>
            ) : undefined
          }
          page={data?.pagination.page ?? page}
          totalPages={data?.pagination.totalPages ?? 1}
          totalItems={data?.pagination.total}
          onPageChange={setPage}
          toolbarActions={null}
        />

        <ProductFormDialog
          isOpen={isFormOpen}
          product={selectedProduct}
          isSubmitting={
            createMutation.isPending || updateMutation.isPending
          }
          onClose={handleCloseForm}
          onSubmit={handleSubmitProduct}
        />

        <ProductDeleteDialog
          isOpen={Boolean(productToDelete)}
          product={productToDelete}
          isDeleting={deleteMutation.isPending}
          onClose={() => {
            if (!deleteMutation.isPending) {
              setProductToDelete(null);
            }
          }}
          onConfirm={handleDeleteProduct}
        />
      </div>
    </DashboardLayout>
  );
}
