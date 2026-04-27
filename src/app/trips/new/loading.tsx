import { Skeleton } from "@/components/ui/skeleton";

export default function NewTripLoading() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
