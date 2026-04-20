import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { updateExpense } from "@/services/expenses";
import type { Expense } from "@/types";

interface UpdateExpenseInput {
  expenseId: string;
  tripId: string;
  updates: Partial<
    Pick<
      Expense,
      | "currency"
      | "description"
      | "paidByMemberId"
      | "splitAmong"
      | "splitType"
      | "totalAmountCents"
    >
  >;
}

export function useUpdateExpenseMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, expenseId, updates }: UpdateExpenseInput) =>
      updateExpense(tripId, expenseId, updates),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      router.push(`/trips/${variables.tripId}`);
    },
  });
}
