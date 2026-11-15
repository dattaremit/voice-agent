import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64 rounded-full" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
