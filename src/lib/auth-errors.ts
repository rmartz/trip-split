import { AUTH_COPY } from "@/constants/copy";

const FIREBASE_ERROR_MAP: Record<string, string> = {
  "auth/wrong-password": AUTH_COPY.errors.invalidCredential,
  "auth/invalid-credential": AUTH_COPY.errors.invalidCredential,
  "auth/user-not-found": AUTH_COPY.errors.invalidCredential,
  "auth/email-already-in-use": AUTH_COPY.errors.emailAlreadyInUse,
  "auth/too-many-requests": AUTH_COPY.errors.tooManyRequests,
  "auth/network-request-failed": AUTH_COPY.errors.networkError,
};

export function getAuthErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return FIREBASE_ERROR_MAP[error.code] ?? AUTH_COPY.errors.generic;
  }
  return AUTH_COPY.errors.generic;
}
