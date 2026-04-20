import type { Expense, TripMember } from "@/types";

import { ExpenseCard } from "./ExpenseCard";
import { EXPENSE_LIST_VIEW_COPY } from "./ExpenseListView.copy";

interface ExpenseListViewProps {
  expenses: Expense[];
  isLoading: boolean;
  members: TripMember[];
}

export function ExpenseListView({
  expenses,
  isLoading,
  members,
}: ExpenseListViewProps) {
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m.name]));
  const sortedExpenses = [...expenses].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <div className="space-y-2">
      {isLoading ? (
        <>
          <div className="bg-muted h-14 animate-pulse rounded-md" />
          <div className="bg-muted h-14 animate-pulse rounded-md" />
          <div className="bg-muted h-14 animate-pulse rounded-md" />
        </>
      ) : sortedExpenses.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {EXPENSE_LIST_VIEW_COPY.emptyState}
        </p>
      ) : (
        sortedExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            paidByName={
              memberMap[expense.paidByMemberId] ?? expense.paidByMemberId
            }
          />
        ))
      )}
    </div>
  );
}
