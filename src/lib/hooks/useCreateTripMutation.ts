import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createTrip } from "@/services/trips";
import type { Trip } from "@/types";

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
      router.push(`/trips/${createdTrip.id}`);
    },
  });
}
