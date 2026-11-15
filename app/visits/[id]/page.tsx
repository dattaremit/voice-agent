import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { VisitOverview } from "@/components/visits/visit-overview";

export default function VisitPage({ params }: PageProps<"/visits/[id]">) {
  return (
    <PageContainer>
      <Suspense fallback={<PageSkeleton />}>
        <VisitOverview params={params} />
      </Suspense>
    </PageContainer>
  );
}
