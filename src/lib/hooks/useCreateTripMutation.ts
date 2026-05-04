import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createTrip } from "@/services/trips";
import type { Trip } from "@/types";
import { MUTATIONS_COPY } from "./mutations.copy";

interface CreateTripInput {
  creatorName: string;
  trip: Omit<Trip, "id" | "createdAt" | "updatedAt">;
}

export function useCreateTripMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ trip, creatorName }: CreateTripInput) =>
      createTrip(trip, creatorName),
    onSuccess: (createdTrip) => {
      toast.success(MUTATIONS_COPY.createTripSuccess);
      router.push(`/trips/${createdTrip.id}`);
    },
    onError: () => {
      toast.error(MUTATIONS_COPY.createTripError);
    },
  });
}
