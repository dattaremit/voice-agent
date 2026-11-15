import type { CallStatus } from "@/lib/repositories/calls";
import { CallTranscript } from "./call-transcript";
import { PreviousCalls } from "./previous-calls";
import { RecordedAnswers } from "./recorded-answers";
import { SummarySection } from "./summary-section";

type CallReviewProps = {
  callId: string;
  patientId: string;
  status: CallStatus;
};

export function CallReview({ callId, patientId, status }: CallReviewProps) {
  return (
    <>
      <SummarySection callId={callId} status={status} />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecordedAnswers callId={callId} />
        <PreviousCalls patientId={patientId} callId={callId} />
      </div>
      <CallTranscript callId={callId} />
    </>
  );
}
