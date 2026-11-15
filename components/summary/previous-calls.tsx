import { SectionCard } from "@/components/shared/section-card";
import { formatDate } from "@/lib/format";
import { listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import { TriageBadge } from "./triage-badge";

const previousCallLimit = 3;

export async function PreviousCalls({ patientId, callId }: { patientId: string; callId: string }) {
  const calls = await listRecentSummariesForPatient(patientId, previousCallLimit, callId);
  return (
    <SectionCard title="Previous calls">
      {calls.length === 0 ? (
        <p className="text-sm text-muted-foreground">This is the first follow-up call.</p>
      ) : (
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
      )}
    </SectionCard>
  );
}
