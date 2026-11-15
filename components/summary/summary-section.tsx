import { getCallSummary } from "@/lib/repositories/call-summaries";
import type { CallStatus } from "@/lib/repositories/calls";
import { CallSummaryCard } from "./call-summary-card";
import { SummaryPending } from "./summary-pending";

export async function SummarySection({ callId, status }: { callId: string; status: CallStatus }) {
  if (status === "failed") return null;
  const summary = await getCallSummary(callId);
  return summary ? <CallSummaryCard summary={summary} /> : <SummaryPending message="Preparing the clinician summary." />;
}
