import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CreateTripForm } from "./CreateTripForm";

export default function NewTripPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-1 items-center justify-center px-4">
        <CreateTripForm />
      </div>
    </ProtectedRoute>
  );
}
