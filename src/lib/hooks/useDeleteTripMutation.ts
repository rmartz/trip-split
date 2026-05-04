import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTrip } from "@/services/trips";
import { MUTATIONS_COPY } from "./mutations.copy";

export function useDeleteTripMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => deleteTrip(tripId),
    onSuccess: () => {
      toast.success(MUTATIONS_COPY.deleteTripSuccess);
      void queryClient.invalidateQueries({ queryKey: ["userTrips"] });
      router.push("/dashboard");
    },
    onError: () => {
      toast.error(MUTATIONS_COPY.deleteTripError);
    },
  });
}
