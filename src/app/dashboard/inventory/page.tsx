"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Package,
  Search,
} from "lucide-react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DataTable from "@/src/components/ui/data-table/DataTable";
import type { DataTableColumn } from "@/src/components/ui/data-table/DataTable";
import { useProducts } from "@/src/hooks/useProducts";
import { formatCurrency, getErrorMessage } from "@/src/lib/utils";
import type { Product } from "@/src/types/product.types";

type StockFilter = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK" | "HEALTHY";

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");

  const { data, isLoading, isError, error, refetch } = useProducts(1, 100);

  const products = data?.products ?? [];

  const totalStockUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockLimit
  );
  const outOfStockProducts = products.filter((p) => p.stockQuantity <= 0);
  const healthyProducts = products.filter(
    (p) => p.stockQuantity > p.lowStockLimit
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        (product.sku && product.sku.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      if (stockFilter === "LOW_STOCK") {
        return (
          product.stockQuantity > 0 &&
          product.stockQuantity <= product.lowStockLimit
        );
      }
      if (stockFilter === "OUT_OF_STOCK") {
        return product.stockQuantity <= 0;
      }
      if (stockFilter === "HEALTHY") {
        return product.stockQuantity > product.lowStockLimit;
      }

      return true;
    });
  }, [products, search, stockFilter]);

  const columns: DataTableColumn<Product>[] = [
    {
      id: "product",
      header: "Product & SKU",
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Package size={17} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {product.name}
            </p>
            <p className="font-mono text-xs text-gray-400">
              {product.sku || "No SKU"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "stock",
      header: "In Stock",
      cell: (product) => (
        <span className="font-bold text-gray-900 sm:text-base dark:text-white">
          {product.stockQuantity.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      id: "limit",
      header: "Alert Threshold",
      cell: (product) => (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ≤ {product.lowStockLimit} units
        </span>
      ),
    },
    {
      id: "health",
      header: "Inventory Health",
      cell: (product) => {
        if (product.stockQuantity <= 0) {
          return (
            <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
              <XCircle size={13} />
              Out of Stock
            </span>
          );
        }
        if (product.stockQuantity <= product.lowStockLimit) {
          return (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              <AlertTriangle size={13} />
              Low Stock Alert
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            Healthy
          </span>
        );
      },
    },
    {
      id: "price",
      header: "Unit Price",
      cell: (product) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(product.price)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) => (
        <Link
          href={`/dashboard/products`}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-2xs transition hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:text-indigo-400 dark:hover:bg-gray-800"
        >
          Manage
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400">
              <Boxes size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                Inventory Management
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Monitor stock levels, track replenishment thresholds, and prevent stockouts.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/products"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:self-auto"
          >
            <Plus size={18} />
            Add Product to Catalog
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Units in Stock
            </p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
              {totalStockUnits.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-gray-500">Across {products.length} catalog items</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Healthy Stock
            </p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {healthyProducts.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">Items above warning limit</p>
          </div>

          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Low Stock Warnings
            </p>
            <p className="mt-2 text-3xl font-extrabold text-amber-700 dark:text-amber-300">
              {lowStockProducts.length}
            </p>
            <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400">Needs replenishment</p>
          </div>

          <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-5 shadow-xs dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              Out of Stock
            </p>
            <p className="mt-2 text-3xl font-extrabold text-red-600 dark:text-red-400">
              {outOfStockProducts.length}
            </p>
            <p className="mt-1 text-xs text-red-500">Zero inventory remaining</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStockFilter("ALL")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              stockFilter === "ALL"
                ? "bg-indigo-600 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
            }`}
          >
            All Items ({products.length})
          </button>

          <button
            type="button"
            onClick={() => setStockFilter("LOW_STOCK")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              stockFilter === "LOW_STOCK"
                ? "bg-amber-600 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
            }`}
          >
            <AlertTriangle size={13} />
            Low Stock ({lowStockProducts.length})
          </button>

          <button
            type="button"
            onClick={() => setStockFilter("OUT_OF_STOCK")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              stockFilter === "OUT_OF_STOCK"
                ? "bg-red-600 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
            }`}
          >
            <XCircle size={13} />
            Out of Stock ({outOfStockProducts.length})
          </button>

          <button
            type="button"
            onClick={() => setStockFilter("HEALTHY")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              stockFilter === "HEALTHY"
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
            }`}
          >
            <CheckCircle2 size={13} />
            Healthy ({healthyProducts.length})
          </button>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={filteredProducts}
          getRowId={(p) => p.id}
          isLoading={isLoading}
          isError={isError}
          errorMessage={getErrorMessage(error, "Failed to load inventory.")}
          onRetry={() => void refetch()}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search inventory by product name or SKU..."
          emptyTitle="No inventory matches found"
          emptyDescription="Try clearing your search query or switching filters."
          totalItems={filteredProducts.length}
        />
      </div>
    </DashboardLayout>
  );
}
