import {api} from "@/src/lib/api";
import type {
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
} from "@/src/types/expense";

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    const response = await api.get("/expenses");
    return response.data.expenses;
  },

  async getExpenseById(id: string): Promise<Expense> {
    const response = await api.get(`/expenses/${id}`);
    return response.data.expense;
  },

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await api.post("/expenses", data);
    return response.data.expense;
  },

  async updateExpense(
    id: string,
    data: UpdateExpenseData,
  ): Promise<Expense> {
    const response = await api.patch(`/expenses/${id}`, data);
    return response.data.expense;
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },
};