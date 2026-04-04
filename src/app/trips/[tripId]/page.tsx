import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TRIP_DETAIL_COPY } from "./TripDetail.copy";

interface TripDetailPageProps {
  params: Promise<{ tripId: string }>;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { tripId } = await params;

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-muted-foreground">
          {TRIP_DETAIL_COPY.loading} (ID: {tripId})
        </p>
      </div>
    </ProtectedRoute>
  );
}
