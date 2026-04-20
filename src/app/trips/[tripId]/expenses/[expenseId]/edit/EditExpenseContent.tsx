"use client";

import { useExpense, useMembers, useUpdateExpenseMutation } from "@/lib/hooks";
import { EDIT_EXPENSE_COPY } from "./EditExpenseFormView.copy";
import { EditExpenseFormView } from "./EditExpenseFormView";

interface EditExpenseContentProps {
  expenseId: string;
  tripId: string;
}

export function EditExpenseContent({
  expenseId,
  tripId,
}: EditExpenseContentProps) {
  const { data: expense, isLoading: isExpenseLoading } = useExpense(
    tripId,
    expenseId,
  );
  const { data: members = [], isLoading: isMembersLoading } =
    useMembers(tripId);
  const mutation = useUpdateExpenseMutation();

  if (isExpenseLoading || isMembersLoading) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8">
        <p className="text-muted-foreground">{EDIT_EXPENSE_COPY.loading}</p>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8">
        <p className="text-muted-foreground">{EDIT_EXPENSE_COPY.notFound}</p>
      </div>
    );
  }

  const handleSubmit = (
    description: string,
    totalAmountCents: number,
    paidByMemberId: string,
    splitAmong: string[],
  ) => {
    mutation.mutate({
      expenseId,
      tripId,
      updates: {
        description,
        paidByMemberId,
        splitAmong,
        totalAmountCents,
      },
    });
  };

  return (
    <EditExpenseFormView
      error={mutation.error?.message}
      expense={expense}
      isPending={mutation.isPending}
      members={members}
      onSubmit={handleSubmit}
      tripId={tripId}
    />
  );
}
