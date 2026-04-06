"use client";

import { formatCurrency } from "@/lib/format";
import type { Expense } from "@/types";

import { EXPENSE_CARD_COPY } from "./ExpenseCard.copy";

interface ExpenseCardProps {
  expense: Expense;
  paidByName: string;
}

export function ExpenseCard({ expense, paidByName }: ExpenseCardProps) {
  const formattedDate = expense.createdAt.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{expense.description}</span>
        <span className="text-muted-foreground text-xs">
          {EXPENSE_CARD_COPY.paidBy(paidByName)} &middot;{" "}
          {EXPENSE_CARD_COPY.splitting(expense.splitAmong.length)} &middot;{" "}
          {formattedDate}
        </span>
      </div>
      <span className="text-sm font-semibold">
        {formatCurrency(expense.totalAmountCents, expense.currency)}
      </span>
    </div>
  );
}
