"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import type { Trip, TripMember } from "@/types";
import { AddMemberForm } from "./AddMemberForm";
import { MemberList } from "./MemberList";
import { TRIP_DETAIL_COPY } from "./TripDetail.copy";

interface TripDetailViewProps {
  isAddingMember: boolean;
  isCreator: boolean;
  isDeletingTrip: boolean;
  members: TripMember[];
  onAddMember: (name: string) => void;
  onDeleteTrip: () => void;
  trip: Trip;
}

export function TripDetailView({
  isAddingMember,
  isCreator,
  isDeletingTrip,
  members,
  onAddMember,
  onDeleteTrip,
  trip,
}: TripDetailViewProps) {
  const handleDelete = () => {
    if (window.confirm(TRIP_DETAIL_COPY.confirmDelete)) {
      onDeleteTrip();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{trip.name}</h1>
          {trip.description && (
            <p className="text-muted-foreground mt-1">{trip.description}</p>
          )}
        </div>
        {isCreator && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeletingTrip}
          >
            {isDeletingTrip
              ? TRIP_DETAIL_COPY.deletingTrip
              : TRIP_DETAIL_COPY.deleteTrip}
          </Button>
        )}
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{TRIP_DETAIL_COPY.expenses}</h2>
          <Link
            href={`/trips/${trip.id}/expenses/new`}
            className={buttonVariants({ size: "sm" })}
          >
            {TRIP_DETAIL_COPY.addExpense}
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-medium">{TRIP_DETAIL_COPY.members}</h2>
        <div className="mt-3 space-y-4">
          <MemberList members={members} />
          <AddMemberForm isPending={isAddingMember} onAdd={onAddMember} />
        </div>
      </div>
    </div>
  );
}
