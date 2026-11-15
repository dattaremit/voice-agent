import { CallHistory } from "@/components/calls/call-history";
import { StartCallForm } from "@/components/calls/start-call-form";
import { PageHeading } from "@/components/layout/page-heading";
import { DetailList } from "@/components/shared/detail-list";
import { SectionCard } from "@/components/shared/section-card";
import { getVisit } from "@/lib/repositories/visits";
import { requireRecord, requireRouteId } from "@/lib/route-id";
import { visitDetailItems } from "./visit-detail-items";

export async function VisitOverview({ params }: { params: Promise<{ id: string }> }) {
  const visit = requireRecord(await getVisit(await requireRouteId(params)));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading title={visit.patientName} description={visit.reason} />
        <StartCallForm visitId={visit.id} />
      </div>
      <SectionCard title="Visit details">
        <DetailList items={visitDetailItems(visit)} />
      </SectionCard>
      <SectionCard title="Follow-up calls">
        <CallHistory visitId={visit.id} />
      </SectionCard>
    </div>
  );
}
