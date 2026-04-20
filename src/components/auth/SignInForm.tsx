"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignInMutation, useSignInWithGoogleMutation } from "@/lib/hooks";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { AUTH_COPY } from "@/constants/copy";

const copy = AUTH_COPY.signIn;
const errors = AUTH_COPY.errors;
const googleCopy = AUTH_COPY.google;

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  );

  const mutation = useSignInMutation();
  const googleMutation = useSignInWithGoogleMutation();

  const validate = (): string | undefined => {
    if (!email.trim()) return errors.emailRequired;
    if (!password) return errors.passwordRequired;
    return undefined;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setValidationError(undefined);

    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }

    mutation.mutate({ email, password });
  };

  const displayError =
    validationError ??
    (mutation.error ? getAuthErrorMessage(mutation.error) : undefined) ??
    (googleMutation.error
      ? getAuthErrorMessage(googleMutation.error)
      : undefined);

  const isPending = mutation.isPending || googleMutation.isPending;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{copy.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError(undefined);
              }}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{copy.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationError(undefined);
              }}
              autoComplete="current-password"
            />
          </div>
          {displayError && (
            <p className="text-destructive text-sm" role="alert">
              {displayError}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {mutation.isPending ? copy.submittingButton : copy.submitButton}
          </Button>
          <div className="relative flex items-center">
            <div className="border-muted flex-grow border-t" />
            <span className="text-muted-foreground mx-3 flex-shrink text-xs">
              {googleCopy.orDivider}
            </span>
            <div className="border-muted flex-grow border-t" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isPending}
            onClick={() => {
              googleMutation.mutate();
            }}
          >
            {googleCopy.signInButton}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            {copy.noAccount}{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              {copy.signUpLink}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
