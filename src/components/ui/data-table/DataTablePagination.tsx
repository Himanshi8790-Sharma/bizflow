"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  page,
  totalPages,
  totalItems,
  isLoading = false,
  onPageChange,
}: DataTablePaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {typeof totalItems === "number"
          ? `${totalItems.toLocaleString("en-IN")} total records`
          : `Page ${page} of ${safeTotalPages}`}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        <span className="px-2 text-xs font-medium text-gray-600 dark:text-gray-400">
          {page} / {safeTotalPages}
        </span>

        <button
          type="button"
          disabled={page >= safeTotalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default DataTablePagination;
