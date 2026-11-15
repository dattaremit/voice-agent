import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeading } from "@/components/layout/page-heading";
import { VisitTable } from "@/components/visits/visit-table";
import { VisitTableSkeleton } from "@/components/visits/visit-table-skeleton";

export default function Home() {
  return (
    <PageContainer>
      <PageHeading title="Recent visits" description="Patients due for a post-visit follow-up call." />
      <Suspense fallback={<VisitTableSkeleton />}>
        <VisitTable />
      </Suspense>
    </PageContainer>
  );
}
