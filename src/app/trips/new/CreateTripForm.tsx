"use client";

import { useAuth } from "@/components/auth";
import { useCreateTripMutation } from "@/lib/hooks";
import { CreateTripFormView } from "./CreateTripFormView";

export function CreateTripForm() {
  const { user } = useAuth();
  const mutation = useCreateTripMutation();

  const handleSubmit = (name: string, description: string) => {
    if (!user) return;

    mutation.mutate({
      trip: {
        createdBy: user.uid,
        description: description || undefined,
        name,
      },
      creatorName: user.displayName ?? user.email ?? "Unknown",
    });
  };

  return (
    <CreateTripFormView
      error={mutation.error?.message}
      isPending={mutation.isPending}
      onSubmit={handleSubmit}
    />
  );
}
