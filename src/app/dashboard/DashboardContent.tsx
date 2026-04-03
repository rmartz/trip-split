"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardContentView } from "./DashboardContentView";

export function DashboardContent() {
  return (
    <ProtectedRoute>
      <DashboardContentView isEmpty={true} />
    </ProtectedRoute>
  );
}
