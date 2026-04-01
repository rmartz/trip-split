"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/components/auth";
import { useSignOutMutation } from "@/lib/hooks";
import { NAV_COPY } from "@/constants/copy";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, loading } = useAuth();
  const signOutMutation = useSignOutMutation();

  return (
    <nav className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          {NAV_COPY.appName}
        </Link>
        {!loading && (
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-muted-foreground text-sm">
                  {user.displayName ?? user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOutMutation.mutate();
                  }}
                  disabled={signOutMutation.isPending}
                >
                  {NAV_COPY.signOut}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  {NAV_COPY.signIn}
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  {NAV_COPY.signUp}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
