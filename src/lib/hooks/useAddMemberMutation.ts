import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { addMember } from "@/services/members";
import { MUTATIONS_COPY } from "./mutations.copy";

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
      toast.success(MUTATIONS_COPY.addMemberSuccess);
      void queryClient.invalidateQueries({
        queryKey: ["members", variables.tripId],
      });
    },
    onError: () => {
      toast.error(MUTATIONS_COPY.addMemberError);
    },
  });
}
