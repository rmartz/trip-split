import { AUTH_COPY } from "@/constants/copy";

const FIREBASE_ERROR_MAP: Record<string, string> = {
  "auth/wrong-password": AUTH_COPY.errors.wrongPassword,
  "auth/invalid-credential": AUTH_COPY.errors.wrongPassword,
  "auth/user-not-found": AUTH_COPY.errors.userNotFound,
  "auth/email-already-in-use": AUTH_COPY.errors.emailAlreadyInUse,
  "auth/too-many-requests": AUTH_COPY.errors.tooManyRequests,
};

export function getAuthErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    const code = (error as { code: string }).code;
    return FIREBASE_ERROR_MAP[code] ?? AUTH_COPY.errors.generic;
  }
  return AUTH_COPY.errors.generic;
}
