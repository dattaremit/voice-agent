import { LiveCallLoader } from "@/modules/calls/live-call/live-call-loader";
import { SectionCard } from "@/components/shared/section-card";
import { CallReview } from "@/modules/summaries/components/call-review";
import { SummaryPending } from "@/modules/summaries/components/summary-pending";
import type { CallStatus } from "@/modules/calls/call-repository";

type CallStageProps = {
  callId: string;
  patientId: string | null;
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
