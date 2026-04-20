import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AddExpenseContent } from "./AddExpenseContent";

interface AddExpensePageProps {
  params: Promise<{ tripId: string }>;
}

export default async function AddExpensePage({ params }: AddExpensePageProps) {
  const { tripId } = await params;

  return (
    <ProtectedRoute>
      <AddExpenseContent tripId={tripId} />
    </ProtectedRoute>
  );
}
