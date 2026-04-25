"use client";

import { useAuth } from "@/components/auth";
import { useAddExpenseMutation, useMembers } from "@/lib/hooks";
import { SplitType } from "@/types";
import { ADD_EXPENSE_COPY } from "./AddExpenseFormView.copy";
import { AddExpenseFormView } from "./AddExpenseFormView";

interface AddExpenseContentProps {
  tripId: string;
}

export function AddExpenseContent({ tripId }: AddExpenseContentProps) {
  const { user } = useAuth();
  const { data: members = [], isLoading } = useMembers(tripId);
  const mutation = useAddExpenseMutation();

  const handleSubmit = (
    description: string,
    totalAmountCents: number,
    paidByMemberId: string,
    splitAmong: string[],
  ) => {
    if (!user) return;

    mutation.mutate({
      tripId,
      expense: {
        createdBy: user.uid,
        currency: "USD",
        description,
        paidByMemberId,
        splitAmong,
        splitType: SplitType.Equal,
        totalAmountCents,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-8">
        <p className="text-muted-foreground">{ADD_EXPENSE_COPY.loading}</p>
      </div>
    );
  }

  return (
    <AddExpenseFormView
      error={mutation.error?.message}
      isPending={mutation.isPending}
      members={members}
      onSubmit={handleSubmit}
      tripId={tripId}
    />
  );
}
