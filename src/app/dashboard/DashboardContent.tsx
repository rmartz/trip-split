"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DASHBOARD_COPY } from "@/constants/copy";

export function DashboardContent() {
  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">{DASHBOARD_COPY.title}</h1>
        <p className="text-muted-foreground mt-2">{DASHBOARD_COPY.empty}</p>
      </div>
    </ProtectedRoute>
  );
}
