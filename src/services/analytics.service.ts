import { api } from "../lib/api";
import type { AnalyticsSummary, AnalyticsSummaryResponse ,RevenueTrendResponse,
  RevenueTrendItem,
  TopProduct,
  TopProductsResponse,
  OrderStatusItem,
  OrderStatusResponse,
  ExpenseCategory,
  ExpensesByCategoryResponse, } from "@/src/types/analytics";

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const response = await api.get<AnalyticsSummaryResponse>(
    "/analytics/summary"
  );

  return response.data.data;
};

export const getRevenueTrend = async (): Promise<RevenueTrendItem[]> => {
  const response = await api.get<RevenueTrendResponse>(
    "/analytics/revenue-trend"
  );

  return response.data.data;
};


export const getTopProducts = async (): Promise<TopProduct[]> => {
  const response = await api.get<TopProductsResponse>(
    "/analytics/top-products"
  );

  return response.data.data;
};

export const getOrderStatus = async (): Promise<OrderStatusItem[]> => {
  const response = await api.get<OrderStatusResponse>(
    "/analytics/order-status"
  );

  return response.data.data;
};

export const getExpensesByCategory = async (): Promise<ExpenseCategory[]> => {
  const response = await api.get<ExpensesByCategoryResponse>(
    "/analytics/expenses-by-category"
  );

  return response.data.data;
};