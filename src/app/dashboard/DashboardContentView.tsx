import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { TripCard } from "@/components/trips";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types";
import { DASHBOARD_COPY } from "./DashboardContent.copy";

interface DashboardContentViewProps {
  isLoading: boolean;
  trips: Trip[];
}

export function DashboardContentView({
  isLoading,
  trips,
}: DashboardContentViewProps) {
  const isEmpty = !isLoading && trips.length === 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{DASHBOARD_COPY.title}</h1>
        <Link href="/trips/new" className={cn(buttonVariants({ size: "sm" }))}>
          {DASHBOARD_COPY.createTrip}
        </Link>
      </div>
      {isLoading && (
        <p className="text-muted-foreground mt-4">{DASHBOARD_COPY.loading}</p>
      )}
      {isEmpty && (
        <p className="text-muted-foreground mt-4">{DASHBOARD_COPY.empty}</p>
      )}
      {trips.length > 0 && (
        <div className="mt-4 grid gap-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              description={trip.description}
              id={trip.id}
              name={trip.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
