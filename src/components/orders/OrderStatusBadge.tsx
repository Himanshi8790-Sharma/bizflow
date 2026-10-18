import type {
  OrderStatus,
  PaymentStatus,
} from "@/src/types/order.types";

interface OrderStatusBadgeProps {
  status: OrderStatus | PaymentStatus;
}

const statusStyles: Record<OrderStatus | PaymentStatus, string> = {
  PENDING:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900",
  CONFIRMED:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900",
  PROCESSING:
    "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:ring-purple-900",
  COMPLETED:
    "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950/30 dark:text-green-300 dark:ring-green-900",
  CANCELLED:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900",
  PAID:
    "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950/30 dark:text-green-300 dark:ring-green-900",
  PARTIAL:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900",
  REFUNDED:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900",
};

export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        statusStyles[status]
      }`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}