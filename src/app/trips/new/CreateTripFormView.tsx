"use client";

import { useState } from "react";

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
import { CREATE_TRIP_COPY } from "./CreateTripForm.copy";

const copy = CREATE_TRIP_COPY;

interface CreateTripFormViewProps {
  error?: string;
  isPending: boolean;
  onSubmit: (name: string, description: string) => void;
}

export function CreateTripFormView({
  error,
  isPending,
  onSubmit,
}: CreateTripFormViewProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  );

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setValidationError(undefined);

    if (!name.trim()) {
      setValidationError(copy.nameRequired);
      return;
    }

    onSubmit(name.trim(), description.trim());
  };

  const displayError = validationError ?? error;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trip-name">{copy.nameLabel}</Label>
            <Input
              id="trip-name"
              placeholder={copy.namePlaceholder}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError(undefined);
              }}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-description">{copy.descriptionLabel}</Label>
            <Input
              id="trip-description"
              placeholder={copy.descriptionPlaceholder}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          {displayError && (
            <p className="text-destructive text-sm" role="alert">
              {displayError}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? copy.submittingButton : copy.submitButton}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
