import { Suspense } from "react";
import { CallOverview } from "@/modules/calls/components/call-overview";
import { PageContainer } from "@/components/layout/page-container";
import { PageSkeleton } from "@/components/shared/page-skeleton";

export default function CallPage({ params }: PageProps<"/calls/[id]">) {
  return (
    <PageContainer>
      <Suspense fallback={<PageSkeleton />}>
        <CallOverview params={params} />
      </Suspense>
    </PageContainer>
  );
}
