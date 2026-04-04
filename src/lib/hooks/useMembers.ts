import { useQuery } from "@tanstack/react-query";

import { getMembers } from "@/services/members";

export function useMembers(tripId: string) {
  return useQuery({
    queryKey: ["members", tripId],
    queryFn: () => getMembers(tripId),
  });
}
