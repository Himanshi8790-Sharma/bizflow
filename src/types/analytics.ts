export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
}

export interface AnalyticsSummaryResponse {
  success: boolean;
  data: AnalyticsSummary;
}

export interface RevenueTrendItem {
  date: string;
  revenue: number;
}

export interface RevenueTrendResponse {
  success: boolean;
  data: RevenueTrendItem[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  name?: string;
  quantitySold: number;
  revenue: number;
}

export interface TopProductsResponse {
  success: boolean;
  data: TopProduct[];
}

export interface OrderStatusItem {
  status: string;
  count: number;
}

export interface OrderStatusResponse {
  success: boolean;
  data: OrderStatusItem[];
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  total?: number;
}

export interface ExpensesByCategoryResponse {
  success: boolean;
  data: ExpenseCategory[];
}