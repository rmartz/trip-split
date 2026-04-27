import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addExpense } from "@/services/expenses";
import type { Expense } from "@/types";
import { MUTATIONS_COPY } from "./mutations.copy";

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
      toast.success(MUTATIONS_COPY.addExpenseSuccess);
      void queryClient.invalidateQueries({
        queryKey: ["expenses", variables.tripId],
      });
      router.push(`/trips/${variables.tripId}`);
    },
    onError: () => {
      toast.error(MUTATIONS_COPY.addExpenseError);
    },
  });
}
