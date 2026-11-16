import { PageHeading } from "@/components/layout/page-heading";
import { getCall } from "@/lib/repositories/calls";
import { getPatient } from "@/lib/repositories/patients";
import { requireRecord, requireRouteId } from "@/lib/route-id";
import { CallStage } from "./call-stage";
import { CallStatusBadge } from "./call-status-badge";
import { callerName } from "./caller-name";

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
