import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth";

export function useSignOutMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      router.push("/sign-in");
    },
  });
}
