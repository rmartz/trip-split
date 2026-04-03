"use client";

import { useAuth } from "@/components/auth";
import { useSignOutMutation } from "@/lib/hooks";
import { NavbarView } from "./NavbarView";

export function Navbar() {
  const { user, loading } = useAuth();
  const signOutMutation = useSignOutMutation();

  if (loading) {
    return null;
  }

  return (
    <NavbarView
      userEmail={user?.displayName ?? user?.email ?? undefined}
      onSignOut={() => {
        signOutMutation.mutate();
      }}
      isSigningOut={signOutMutation.isPending}
    />
  );
}
