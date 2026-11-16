import { getCallSummary } from "@/modules/summaries/summary-repository";
import type { CallStatus } from "@/modules/calls/call-repository";
import { CallSummaryCard } from "@/modules/summaries/components/call-summary-card";
import { SummaryPending } from "@/modules/summaries/components/summary-pending";

export async function SummarySection({ callId, status }: { callId: string; status: CallStatus }) {
  if (status === "failed") return null;
  const summary = await getCallSummary(callId);
  return summary ? <CallSummaryCard summary={summary} /> : <SummaryPending message="Preparing the clinician summary." />;
}
