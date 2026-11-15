import { LiveCallLoader } from "@/components/live-call/live-call-loader";
import { PageHeading } from "@/components/layout/page-heading";
import { DetailList } from "@/components/shared/detail-list";
import { SectionCard } from "@/components/shared/section-card";
import { visitDetailItems } from "@/components/visits/visit-detail-items";
import { getCall } from "@/lib/repositories/calls";
import { getVisit } from "@/lib/repositories/visits";
import { requireRecord, requireRouteId } from "@/lib/route-id";
import { CallStatusBadge } from "./call-status-badge";

export async function CallOverview({ params }: { params: Promise<{ id: string }> }) {
  const call = requireRecord(await getCall(await requireRouteId(params)));
  const visit = requireRecord(await getVisit(call.visitId));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading title={`Follow-up with ${visit.patientName}`} description={visit.reason} />
        <CallStatusBadge status={call.status} />
      </div>
      {call.status === "scheduled" && (
        <SectionCard title="Live call">
          <LiveCallLoader callId={call.id} />
        </SectionCard>
      )}
      <SectionCard title="Visit details">
        <DetailList items={visitDetailItems(visit)} />
      </SectionCard>
    </div>
  );
}
