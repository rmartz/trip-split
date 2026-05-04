import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EditExpenseContent } from "./EditExpenseContent";

interface EditExpensePageProps {
  params: Promise<{ expenseId: string; tripId: string }>;
}

export default async function EditExpensePage({
  params,
}: EditExpensePageProps) {
  const { expenseId, tripId } = await params;

  return (
    <ProtectedRoute>
      <EditExpenseContent expenseId={expenseId} tripId={tripId} />
    </ProtectedRoute>
  );
}
