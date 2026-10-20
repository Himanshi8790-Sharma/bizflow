import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { expenseService } from "@/src/services/expense.service";
import type {
  CreateExpenseData,
  UpdateExpenseData,
} from "@/src/types/expense";

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: expenseService.getExpenses,
  });
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => expenseService.getExpenseById(id),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseData) =>
      expenseService.createExpense(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateExpenseData;
    }) => expenseService.updateExpense(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.id],
      });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}