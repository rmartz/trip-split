import { useQuery } from "@tanstack/react-query";

import { getTrip } from "@/services/trips";

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getTrip(tripId),
  });
}
