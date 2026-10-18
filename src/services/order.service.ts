import { api } from "@/src/lib/api";

import type {
  CreateOrderInput,
  Order,
  UpdateOrderStatusInput,
} from "@/src/types/order.types";

interface ApiOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: {
    name: string;
  };
}

interface ApiOrder extends Omit<Order, "items"> {
  items: ApiOrderItem[];
}

interface ApiOrderListResponse {
  success: boolean;
  data: ApiOrder[];
}

interface ApiOrderResponse {
  success: boolean;
  message?: string;
  data: ApiOrder;
}

function normalizeOrder(order: ApiOrder): Order {
  return {
    ...order,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.total,
    })),
  };
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<ApiOrderListResponse>("/orders");

    if (!Array.isArray(response.data.data)) {
      throw new Error("The orders API returned an invalid response.");
    }

    return response.data.data.map(normalizeOrder);
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiOrderResponse>(`/orders/${id}`);

    return normalizeOrder(response.data.data);
  },

  async createOrder(data: CreateOrderInput): Promise<Order> {
    const response = await api.post<ApiOrderResponse>("/orders", data);

    return normalizeOrder(response.data.data);
  },

  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusInput,
  ): Promise<Order> {
    const response = await api.patch<ApiOrderResponse>(
      `/orders/${id}/status`,
      data,
    );

    return normalizeOrder(response.data.data);
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.post<ApiOrderResponse>(
      `/orders/${id}/cancel`,
    );

    return normalizeOrder(response.data.data);
  },
};