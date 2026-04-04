import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { deleteTrip } from "@/services/trips";

export function useDeleteTripMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => deleteTrip(tripId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userTrips"] });
      router.push("/dashboard");
    },
  });
}
