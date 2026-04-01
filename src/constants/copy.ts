export const NAV_COPY = {
  appName: "Trip Split",
  signIn: "Sign in",
  signUp: "Sign up",
  signOut: "Sign out",
} as const;

export const DASHBOARD_COPY = {
  title: "Dashboard",
  empty: "You don\u2019t have any trips yet.",
} as const;

export const AUTH_COPY = {
  signIn: {
    title: "Sign in",
    description: "Enter your email and password to sign in.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    submitButton: "Sign in",
    submittingButton: "Signing in\u2026",
    noAccount: "Don't have an account?",
    signUpLink: "Sign up",
  },
  signUp: {
    title: "Create an account",
    description: "Enter your details to get started.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    submitButton: "Create account",
    submittingButton: "Creating account\u2026",
    hasAccount: "Already have an account?",
    signInLink: "Sign in",
  },
  errors: {
    emailRequired: "Email is required.",
    emailInvalid: "Please enter a valid email address.",
    passwordRequired: "Password is required.",
    passwordTooShort: "Password must be at least 6 characters.",
    passwordMismatch: "Passwords do not match.",
    invalidCredential: "Invalid email or password.",
    emailAlreadyInUse: "An account with this email already exists.",
    tooManyRequests: "Too many attempts. Please try again later.",
    networkError: "Check your internet connection and try again.",
    generic: "Something went wrong. Please try again.",
  },
} as const;
