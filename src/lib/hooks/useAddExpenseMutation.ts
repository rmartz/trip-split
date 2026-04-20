import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { addExpense } from "@/services/expenses";
import type { Expense } from "@/types";

interface AddExpenseInput {
  expense: Omit<Expense, "id" | "createdAt" | "updatedAt">;
  tripId: string;
}

export function useAddExpenseMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, expense }: AddExpenseInput) =>
      addExpense(tripId, expense),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      router.push(`/trips/${variables.tripId}`);
    },
  });
}
