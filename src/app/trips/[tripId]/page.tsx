import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TripDetailContent } from "./TripDetailContent";

interface TripDetailPageProps {
  params: Promise<{ tripId: string }>;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { tripId } = await params;

  return (
    <ProtectedRoute>
      <TripDetailContent tripId={tripId} />
    </ProtectedRoute>
  );
}
