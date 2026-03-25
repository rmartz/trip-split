import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { signIn, signUp } from "@/lib/auth";

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
  });
}
