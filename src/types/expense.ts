export interface Expense {
  id: string;
  organizationId: string;
  createdById: string;
  title: string;
  description: string | null;
  amount: number;
  category: string | null;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateExpenseData {
  title: string;
  description?: string;
  amount: number;
  category?: string;
  expenseDate: string;
}

export interface UpdateExpenseData {
  title?: string;
  description?: string | null;
  amount?: number;
  category?: string | null;
  expenseDate?: string;
}