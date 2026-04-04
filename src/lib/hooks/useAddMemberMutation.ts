import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addMember } from "@/services/members";

interface AddMemberInput {
  addedBy: string;
  name: string;
  tripId: string;
}

export function useAddMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, name, addedBy }: AddMemberInput) =>
      addMember(tripId, { addedBy, name }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["members", variables.tripId],
      });
    },
  });
}
