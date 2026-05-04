import { useQuery } from "@tanstack/react-query";

import { getExpense } from "@/services/expenses";

export function useExpense(tripId: string, expenseId: string) {
  return useQuery({
    queryKey: ["expenses", tripId, expenseId],
    queryFn: () => getExpense(tripId, expenseId),
  });
}
