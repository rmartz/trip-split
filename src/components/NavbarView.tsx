"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { NAV_COPY } from "./Navbar.copy";
import { cn } from "@/lib/utils";

interface NavbarViewProps {
  userEmail: string | undefined;
  onSignOut: () => void;
  isSigningOut: boolean;
}

export function NavbarView({
  userEmail,
  onSignOut,
  isSigningOut,
}: NavbarViewProps) {
  return (
    <nav className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          {NAV_COPY.appName}
        </Link>
        <div className="flex items-center gap-2">
          {userEmail ? (
            <>
              <span className="text-muted-foreground text-sm">{userEmail}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSignOut}
                disabled={isSigningOut}
              >
                {NAV_COPY.signOut}
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
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
      </div>
    </nav>
  );
}
