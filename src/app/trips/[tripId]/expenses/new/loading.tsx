import { Skeleton } from "@/components/ui/skeleton";

export default function AddExpenseLoading() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
