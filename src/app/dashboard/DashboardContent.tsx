"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUserTrips } from "@/lib/hooks";
import { DashboardContentView } from "./DashboardContentView";

export function DashboardContent() {
  const { data: trips, isLoading } = useUserTrips();

  return (
    <ProtectedRoute>
      <DashboardContentView isLoading={isLoading} trips={trips ?? []} />
    </ProtectedRoute>
  );
}
