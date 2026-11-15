import { LiveCallLoader } from "@/components/live-call/live-call-loader";
import { SectionCard } from "@/components/shared/section-card";
import { CallReview } from "@/components/summary/call-review";
import { SummaryPending } from "@/components/summary/summary-pending";
import type { CallStatus } from "@/lib/repositories/calls";

type CallStageProps = {
  callId: string;
  patientId: string;
  status: CallStatus;
};

export function CallStage({ callId, patientId, status }: CallStageProps) {
  if (status === "scheduled") {
    return (
      <SectionCard title="Live call">
        <LiveCallLoader callId={callId} />
      </SectionCard>
    );
  }
  if (status === "in_progress") return <SummaryPending message="The call is in progress." />;
  return <CallReview callId={callId} patientId={patientId} status={status} />;
}
