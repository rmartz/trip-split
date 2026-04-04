"use client";

import { useAuth } from "@/components/auth";
import {
  useAddMemberMutation,
  useDeleteTripMutation,
  useMembers,
  useTrip,
} from "@/lib/hooks";
import { TRIP_DETAIL_COPY } from "./TripDetail.copy";
import { TripDetailView } from "./TripDetailView";

interface TripDetailContentProps {
  tripId: string;
}

export function TripDetailContent({ tripId }: TripDetailContentProps) {
  const { user } = useAuth();
  const { data: trip, isLoading: isTripLoading } = useTrip(tripId);
  const { data: members } = useMembers(tripId);
  const addMemberMutation = useAddMemberMutation();
  const deleteTripMutation = useDeleteTripMutation();

  if (isTripLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-muted-foreground">{TRIP_DETAIL_COPY.loading}</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-muted-foreground">{TRIP_DETAIL_COPY.notFound}</p>
      </div>
    );
  }

  return (
    <TripDetailView
      isAddingMember={addMemberMutation.isPending}
      isCreator={user?.uid === trip.createdBy}
      isDeletingTrip={deleteTripMutation.isPending}
      members={members ?? []}
      onAddMember={(name) => {
        if (!user) return;
        addMemberMutation.mutate({ addedBy: user.uid, name, tripId });
      }}
      onDeleteTrip={() => {
        deleteTripMutation.mutate(tripId);
      }}
      trip={trip}
    />
  );
}
