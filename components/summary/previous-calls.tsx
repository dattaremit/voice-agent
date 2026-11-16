import { SectionCard } from "@/components/shared/section-card";
import { formatDate } from "@/lib/format";
import { listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import { TriageBadge } from "./triage-badge";

const previousCallLimit = 3;

async function PreviousCallList({ patientId, callId }: { patientId: string; callId: string }) {
  const calls = await listRecentSummariesForPatient(patientId, previousCallLimit, callId);
  if (calls.length === 0) return <p className="text-sm text-muted-foreground">This is the patient&apos;s first call.</p>;
  return (
    <ul className="space-y-4">
      {calls.map((call) => (
        <li key={call.date.toISOString()} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-sm font-medium">
            {formatDate(call.date)}
            <TriageBadge level={call.triageLevel} />
          </div>
          <p className="text-sm text-muted-foreground">{call.summary}</p>
        </li>
      ))}
    </ul>
  );
}

export function PreviousCalls({ patientId, callId }: { patientId: string | null; callId: string }) {
  return (
    <SectionCard title="Previous calls">
      {patientId ? (
        <PreviousCallList patientId={patientId} callId={callId} />
      ) : (
        <p className="text-sm text-muted-foreground">The caller was not identified.</p>
      )}
    </SectionCard>
  );
}
