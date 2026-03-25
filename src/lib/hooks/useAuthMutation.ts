import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { signIn, signUp } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/auth-errors";

interface AuthCredentials {
  email: string;
  password: string;
}

export function useSignInMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: AuthCredentials) =>
      signIn(email, password),
    onSuccess: () => {
      router.push("/dashboard");
    },
    meta: { getErrorMessage: getAuthErrorMessage },
  });
}

export function useSignUpMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: AuthCredentials) =>
      signUp(email, password),
    onSuccess: () => {
      router.push("/dashboard");
    },
    meta: { getErrorMessage: getAuthErrorMessage },
  });
}
