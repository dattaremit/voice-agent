import { Suspense } from "react";
import { PageHeading } from "@/components/layout/page-heading";
import { VisitTable } from "@/components/visits/visit-table";
import { VisitTableSkeleton } from "@/components/visits/visit-table-skeleton";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
      <PageHeading title="Recent visits" description="Patients due for a post-visit follow-up call." />
      <Suspense fallback={<VisitTableSkeleton />}>
        <VisitTable />
      </Suspense>
    </main>
  );
}
