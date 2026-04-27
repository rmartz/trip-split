"use client";

import { useAuth } from "@/components/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddExpenseMutation, useMembers } from "@/lib/hooks";
import type { ExpenseFormSubmitData } from "@/types";
import { AddExpenseFormView } from "./AddExpenseFormView";

interface AddExpenseContentProps {
  tripId: string;
}

export function AddExpenseContent({ tripId }: AddExpenseContentProps) {
  const { user } = useAuth();
  const { data: members = [], isLoading } = useMembers(tripId);
  const mutation = useAddExpenseMutation();

  const handleSubmit = (data: ExpenseFormSubmitData) => {
    if (!user) return;

    mutation.mutate({
      tripId,
      expense: {
        createdBy: user.uid,
        currency: "USD",
        description: data.description,
        items: data.items,
        paidByMemberId: data.paidByMemberId,
        splitAmong: data.splitAmong,
        splitType: data.splitType,
        taxCents: data.taxCents,
        tipCents: data.tipCents,
        totalAmountCents: data.totalAmountCents,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
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
