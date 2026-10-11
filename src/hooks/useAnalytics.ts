import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary,getExpensesByCategory,getOrderStatus,getRevenueTrend, getTopProducts } from "../services/analytics.service";

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: getAnalyticsSummary,
  });
}

export function useRevenueTrend() {
  return useQuery({
    queryKey: ["analytics", "revenue-trend"],
    queryFn: getRevenueTrend,
  });
} 

export function useTopProducts() {
  return useQuery({
    queryKey: ["analytics", "top-products"],
    queryFn: getTopProducts,
  });
}


export function useOrderStatus() {
  return useQuery({
    queryKey: ["analytics", "order-status"],
    queryFn: getOrderStatus,
  });
}

export function useExpensesByCategory() {
  return useQuery({
    queryKey: ["analytics", "expenses-by-category"],
    queryFn: getExpensesByCategory,
  });
}