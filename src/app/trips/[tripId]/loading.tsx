import { Skeleton } from "@/components/ui/skeleton";

export default function TripDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}
