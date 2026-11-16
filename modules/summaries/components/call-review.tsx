import type { CallStatus } from "@/modules/calls/call-repository";
import { CallAppointments } from "@/modules/summaries/components/call-appointments";
import { CallTranscript } from "@/modules/summaries/components/call-transcript";
import { PreviousCalls } from "@/modules/summaries/components/previous-calls";
import { RecordedAnswers } from "@/modules/summaries/components/recorded-answers";
import { SummarySection } from "@/modules/summaries/components/summary-section";

type CallReviewProps = {
  callId: string;
  patientId: string | null;
  status: CallStatus;
};

export function CallReview({ callId, patientId, status }: CallReviewProps) {
  return (
    <>
      <SummarySection callId={callId} status={status} />
      <CallAppointments callId={callId} />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecordedAnswers callId={callId} />
        <PreviousCalls patientId={patientId} callId={callId} />
      </div>
      <CallTranscript callId={callId} />
    </>
  );
}
