"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import ExpensesPageHeader from "@/src/components/expenses/ExpensesPageHeader";
import ExpenseFormDialog from "@/src/components/expenses/ExpenseFormDialog";
import ExpenseDeleteDialog from "@/src/components/expenses/ExpenseDeleteDialog";

import { useExpenses } from "@/src/hooks/useExpenses";
import type { Expense } from "@/src/types/expense";

export default function ExpensesPage() {
  const { data: expenses = [], isLoading, isError } = useExpenses();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const totalExpenses = useMemo(
    () => expenses.reduce((total, expense) => total + expense.amount, 0),
    [expenses],
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount / 100);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN");

  function handleAddExpense() {
    setSelectedExpense(null);
    setFormOpen(true);
  }

  function handleEditExpense(expense: Expense) {
    setSelectedExpense(expense);
    setFormOpen(true);
  }

  function handleDeleteExpense(expense: Expense) {
    setSelectedExpense(expense);
    setDeleteOpen(true);
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 p-4 md:p-6">
        <ExpensesPageHeader onAddExpense={handleAddExpense} />

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Expenses
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatCurrency(totalExpenses)}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {expenses.length} recorded expenses
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">All Expenses</h2>
            <p className="text-sm text-muted-foreground">
              View and manage your business expenses.
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading expenses...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-destructive">
              Failed to load expenses. Please try again.
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No expenses found. Click Add Expense to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium">{expense.title}</div>

                        {expense.description && (
                          <div className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                            {expense.description}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {expense.category || "Uncategorized"}
                      </td>

                      <td className="px-4 py-3">
                        {formatDate(expense.expenseDate)}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(expense.amount)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditExpense(expense)}
                            className="rounded-md border p-2 hover:bg-muted"
                            aria-label="Edit expense"
                            title="Edit expense"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(expense)}
                            className="rounded-md border p-2 text-destructive hover:bg-destructive/10"
                            aria-label="Delete expense"
                            title="Delete expense"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ExpenseFormDialog
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setSelectedExpense(null);
          }}
          expense={selectedExpense}
        />

        <ExpenseDeleteDialog
          open={deleteOpen}
          expense={selectedExpense}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedExpense(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
}