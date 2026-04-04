import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/auth";
import { getUserTrips } from "@/services/trips";

export function useUserTrips() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userTrips", user?.uid],
    queryFn: () => getUserTrips(user!.uid), // eslint-disable-line @typescript-eslint/no-non-null-assertion -- enabled guard ensures user exists
    enabled: !!user,
  });
}
