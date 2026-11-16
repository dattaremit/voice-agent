import { PageHeading } from "@/components/layout/page-heading";
import { getCall } from "@/modules/calls/call-repository";
import { getPatient } from "@/modules/patients/patient-repository";
import { requireRecord } from "@/lib/routing/require-record";
import { requireRouteId } from "@/lib/routing/route-id";
import { CallStage } from "@/modules/calls/components/call-stage";
import { CallStatusBadge } from "@/modules/calls/components/call-status-badge";
import { callerName } from "@/modules/calls/components/caller-name";

export async function CallOverview({ params }: { params: Promise<{ id: string }> }) {
  const call = requireRecord(await getCall(await requireRouteId(params)));
  const patient = call.patientId ? await getPatient(call.patientId) : undefined;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading title="Patient call" description={callerName(patient?.name)} />
        <CallStatusBadge status={call.status} />
      </div>
      <CallStage callId={call.id} patientId={call.patientId} status={call.status} />
    </div>
  );
}
