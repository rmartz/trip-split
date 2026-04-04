"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRIP_DETAIL_COPY } from "./TripDetail.copy";

interface AddMemberFormProps {
  isPending: boolean;
  onAdd: (name: string) => void;
}

export function AddMemberForm({ isPending, onAdd }: AddMemberFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) return;

    onAdd(trimmed);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder={TRIP_DETAIL_COPY.addMemberPlaceholder}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        className="flex-1"
      />
      <Button type="submit" size="sm" disabled={isPending || !name.trim()}>
        {TRIP_DETAIL_COPY.addMember}
      </Button>
    </form>
  );
}
