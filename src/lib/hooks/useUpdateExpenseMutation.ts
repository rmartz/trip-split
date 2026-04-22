import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateExpense } from "@/services/expenses";
import type { Expense } from "@/types";

interface UpdateExpenseInput {
  expenseId: string;
  onSuccess?: () => void;
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, expenseId, updates }: UpdateExpenseInput) =>
      updateExpense(tripId, expenseId, updates),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      variables.onSuccess?.();
    },
  });
}
