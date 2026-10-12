"use client";

import type { ReactNode } from "react";
import { RefreshCw, Search } from "lucide-react";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor?: (row: T) => ReactNode;
  cell?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;

  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;

  page?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;

  toolbarActions?: ReactNode;
}

export default function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading = false,
  isError = false,
  errorMessage = "Something went wrong while loading data.",
  onRetry,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  emptyTitle = "No records found",
  emptyDescription = "Records will appear here when available.",
  emptyAction,
  page = 1,
  totalPages = 1,
  totalItems,
  onPageChange,
  toolbarActions,
}: DataTableProps<T>) {
  const showSearch = onSearchChange !== undefined;
  const showPagination = onPageChange !== undefined;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      {/* Toolbar */}
      {(showSearch || toolbarActions) && (
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          {showSearch ? (
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={searchValue ?? ""}
                onChange={(event) =>
                  onSearchChange?.(event.target.value)
                }
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          ) : (
            <div />
          )}

          {toolbarActions && (
            <div className="flex shrink-0 items-center gap-2">
              {toolbarActions}
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div
          role="status"
          className="flex flex-col items-center justify-center px-6 py-16"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Loading data...
          </p>
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="px-6 py-12 text-center">
          <p className="font-medium text-red-600 dark:text-red-400">
            {errorMessage}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                      column.headerClassName ?? ""
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/60"
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`px-6 py-4 text-sm text-gray-700 dark:text-gray-300 ${
                        column.className ?? ""
                      }`}
                    >
                      {column.cell
                        ? column.cell(row)
                        : column.accessor
                          ? column.accessor(row)
                          : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {emptyTitle}
          </h3>

          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            {emptyDescription}
          </p>

          {emptyAction && (
            <div className="mt-5">
              {emptyAction}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {typeof totalItems === "number"
              ? `${totalItems} total records`
              : `Page ${page} of ${Math.max(totalPages, 1)}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange?.(page - 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-gray-600 dark:text-gray-400">
              {page} / {Math.max(totalPages, 1)}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange?.(page + 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}