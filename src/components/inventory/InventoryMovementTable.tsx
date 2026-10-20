"use client";

import type { InventoryMovement } from "@/src/types/inventory.types";

interface InventoryMovementTableProps {
  movements: InventoryMovement[];
  isLoading?: boolean;
}

const movementStyles: Record<string, string> = {
  INCREASE:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  RESTOCK:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  RETURN:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DECREASE:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  SALE:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  ADJUSTMENT:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function formatMovementType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InventoryMovementTable({
  movements,
  isLoading = false,
}: InventoryMovementTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Stock Movement History
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Recent inventory stock changes
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
            <tr>
              <th className="whitespace-nowrap px-5 py-3 font-medium">
                Product
              </th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">
                Movement
              </th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">
                Quantity
              </th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">
                Stock Change
              </th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">
                Reason
              </th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">
                Updated By
              </th>
              <th className="whitespace-nowrap px-5 py-3 font-medium">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    </td>
                  ))}
                </tr>
              ))
            ) : movements.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No stock movements found.
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr
                  key={movement.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {movement.product.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      SKU: {movement.product.sku || "N/A"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        movementStyles[movement.type] ??
                        movementStyles.ADJUSTMENT
                      }`}
                    >
                      {formatMovementType(movement.type)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900 dark:text-white">
                    {movement.quantity}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      {movement.previousStock}
                    </span>

                    <span className="mx-2 text-gray-400">→</span>

                    <span className="font-semibold text-gray-900 dark:text-white">
                      {movement.newStock}
                    </span>
                  </td>

                  <td className="max-w-48 px-5 py-4 text-gray-600 dark:text-gray-300">
                    <span className="block truncate">
                      {movement.reason || "—"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                    {movement.createdBy.name}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500 dark:text-gray-400">
                    {formatDate(movement.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && movements.length > 0 && (
        <div className="border-t border-gray-200 px-5 py-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Showing {movements.length} recent movements
        </div>
      )}
    </div>
  );
}