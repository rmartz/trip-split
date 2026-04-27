"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { data: expense, isLoading: isExpenseLoading } = useExpense(
    tripId,
    expenseId,
  );
  const { data: members = [], isLoading: isMembersLoading } =
    useMembers(tripId);
  const mutation = useUpdateExpenseMutation();

  const handleSubmit = (
    description: string,
    totalAmountCents: number,
    paidByMemberId: string,
    splitAmong: string[],
  ) => {
    mutation.mutate({
      expenseId,
      onSuccess: () => {
        router.push(`/trips/${tripId}`);
      },
      tripId,
      updates: {
        description,
        paidByMemberId,
        splitAmong,
        totalAmountCents,
      },
    });
  };

  return isExpenseLoading || isMembersLoading ? (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <p className="text-muted-foreground">{EDIT_EXPENSE_COPY.loading}</p>
    </div>
  ) : !expense ? (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <p className="text-muted-foreground">{EDIT_EXPENSE_COPY.notFound}</p>
    </div>
  ) : (
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
