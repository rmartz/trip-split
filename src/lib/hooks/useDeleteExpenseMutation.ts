import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExpense } from "@/services/expenses";

interface DeleteExpenseInput {
  expenseId: string;
  tripId: string;
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, expenseId }: DeleteExpenseInput) =>
      deleteExpense(tripId, expenseId),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
    },
  });
}
