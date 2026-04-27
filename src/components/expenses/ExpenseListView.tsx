import type { Expense, TripMember } from "@/types";

import { ExpenseCard } from "./ExpenseCard";
import { EXPENSE_LIST_VIEW_COPY } from "./ExpenseListView.copy";

interface ExpenseListViewProps {
  currentUserId?: string;
  expenses: Expense[];
  isLoading: boolean;
  members: TripMember[];
  onDeleteExpense?: (expenseId: string) => void;
  tripCreatorId?: string;
  tripId: string;
}

export function ExpenseListView({
  currentUserId,
  expenses,
  isLoading,
  members,
  onDeleteExpense,
  tripCreatorId,
  tripId,
}: ExpenseListViewProps) {
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m.name]));
  const sortedExpenses = [...expenses].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  const expenseRows = sortedExpenses.map((expense) => {
    const canEdit =
      !!currentUserId &&
      (expense.createdBy === currentUserId || tripCreatorId === currentUserId);
    const handleDelete =
      canEdit && onDeleteExpense
        ? () => {
            onDeleteExpense(expense.id);
          }
        : undefined;
    return { expense, canEdit, handleDelete };
  });

  return (
    <div className="space-y-2">
      {isLoading ? (
        <>
          <div className="bg-muted h-14 animate-pulse rounded-md" />
          <div className="bg-muted h-14 animate-pulse rounded-md" />
          <div className="bg-muted h-14 animate-pulse rounded-md" />
        </>
      ) : expenseRows.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {EXPENSE_LIST_VIEW_COPY.emptyState}
        </p>
      ) : (
        expenseRows.map(({ expense, canEdit, handleDelete }) => (
          <ExpenseCard
            key={expense.id}
            canEdit={canEdit}
            expense={expense}
            onDelete={handleDelete}
            paidByName={
              memberMap[expense.paidByMemberId] ?? expense.paidByMemberId
            }
            tripId={tripId}
          />
        ))
      )}
    </div>
  );
}
