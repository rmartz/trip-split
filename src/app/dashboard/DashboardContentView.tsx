import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DASHBOARD_COPY } from "./DashboardContent.copy";

interface DashboardContentViewProps {
  isEmpty: boolean;
}

export function DashboardContentView({ isEmpty }: DashboardContentViewProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{DASHBOARD_COPY.title}</h1>
        <Link href="/trips/new" className={cn(buttonVariants({ size: "sm" }))}>
          {DASHBOARD_COPY.createTrip}
        </Link>
      </div>
      {isEmpty && (
        <p className="text-muted-foreground mt-4">{DASHBOARD_COPY.empty}</p>
      )}
    </div>
  );
}
