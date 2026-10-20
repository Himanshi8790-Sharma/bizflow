"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useCreateExpense,
  useUpdateExpense,
} from "@/src/hooks/useExpenses";

import type {
  Expense,
  CreateExpenseData,
} from "@/src/types/expense";

interface ExpenseFormDialogProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export default function ExpenseFormDialog({
  open,
  onClose,
  expense,
}: ExpenseFormDialogProps) {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setDescription(expense.description ?? "");
      setAmount(String(expense.amount / 100));
      setCategory(expense.category ?? "");
      setExpenseDate(expense.expenseDate.slice(0, 10));
    } else {
      setTitle("");
      setDescription("");
      setAmount("");
      setCategory("");
      setExpenseDate(new Date().toISOString().slice(0, 10));
    }
  }, [expense, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const amountInRupees = Number(amount);

    if (!Number.isFinite(amountInRupees) || amountInRupees <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const amountInPaise = Math.round(amountInRupees * 100);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (!title.trim() || !expenseDate) {
      toast.error("Title and expense date are required");
      return;
    }

    const data: CreateExpenseData = {
      title: title.trim(),
      description: description.trim() || undefined,
      amount: amountInPaise,
      category: category.trim() || undefined,
      expenseDate: new Date(
        `${expenseDate}T12:00:00.000Z`,
      ).toISOString(),
    };

    try {
      if (expense) {
        await updateExpense.mutateAsync({
          id: expense.id,
          data,
        });

        toast.success("Expense updated successfully");
      } else {
        await createExpense.mutateAsync(data);
        toast.success("Expense created successfully");
      }

      onClose();
    } catch {
      toast.error("Failed to save expense");
    }
  }

  const isSaving = createExpense.isPending || updateExpense.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl">
        <h2 className="text-xl font-semibold">
          {expense ? "Edit Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={150}
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="Office Rent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Amount (₹) *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="25000"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={100}
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="Rent, Salary, Travel..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Expense Date *
            </label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : expense
                  ? "Update Expense"
                  : "Create Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}