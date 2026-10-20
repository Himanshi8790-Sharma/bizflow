"use client";

import { Plus } from "lucide-react";

interface ExpensesPageHeaderProps {
  onAddExpense: () => void;
}

export default function ExpensesPageHeader({
  onAddExpense,
}: ExpensesPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Expenses
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage and track your business expenses.
        </p>
      </div>

      <button
        onClick={onAddExpense}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Plus size={18} />
        Add Expense
      </button>
    </div>
  );
}