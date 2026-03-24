"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { signIn } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { AUTH_COPY } from "@/constants/copy";

const copy = AUTH_COPY.signIn;
const errors = AUTH_COPY.errors;

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const validate = (): string | undefined => {
    if (!email.trim()) return errors.emailRequired;
    if (!password) return errors.passwordRequired;
    return undefined;
  };

  const submitAuth = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(undefined);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    void submitAuth();
  };

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
              }}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {copy.submitButton}
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
