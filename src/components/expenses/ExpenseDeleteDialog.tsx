"use client";

import { toast } from "sonner";
import { useDeleteExpense } from "@/src/hooks/useExpenses";
import type { Expense } from "@/src/types/expense";

interface ExpenseDeleteDialogProps {
  expense: Expense | null;
  open: boolean;
  onClose: () => void;
}

export default function ExpenseDeleteDialog({
  expense,
  open,
  onClose,
}: ExpenseDeleteDialogProps) {
  const deleteExpense = useDeleteExpense();

  if (!open || !expense) {
    return null;
  }

  async function handleDelete() {
    try {
      await deleteExpense.mutateAsync(expense!.id);
      toast.success("Expense deleted successfully");
      onClose();
    } catch {
      toast.error("Failed to delete expense");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Delete Expense</h2>

        <p className="mt-3 text-sm text-muted-foreground">
          Are you sure you want to delete "{expense.title}"? This action will
          remove the expense from your active expenses list.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteExpense.isPending}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteExpense.isPending}
            className="rounded-md bg-destructive px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {deleteExpense.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}