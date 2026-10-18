export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "PARTIAL"
  | "REFUNDED";

export type UpdatableOrderStatus = Exclude<
  OrderStatus,
  "PENDING" | "CANCELLED"
>;

export interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  organizationId: string;
  customerId: string | null;
  orderNumber: string;
  customer?: {
    id: string;
    name: string;
  } | null;
  items: OrderItem[];
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  notes?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: OrdersPagination;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data: Order;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerId: string;
  items: CreateOrderItemInput[];
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
}

export interface UpdateOrderStatusInput {
  status: UpdatableOrderStatus;
}