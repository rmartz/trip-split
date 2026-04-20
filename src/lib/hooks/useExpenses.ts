import { useQuery } from "@tanstack/react-query";

import { getExpenses } from "@/services/expenses";

export function useExpenses(tripId: string) {
  return useQuery({
    queryKey: ["expenses", tripId],
    queryFn: () => getExpenses(tripId),
  });
}
