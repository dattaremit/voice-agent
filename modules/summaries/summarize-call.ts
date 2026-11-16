import { insertCallSummary } from "@/modules/summaries/summary-repository";
import { generateSummary } from "@/modules/summaries/generate-summary";
import { loadSummaryInput } from "@/modules/summaries/load-summary-input";

export async function summarizeCall(callId: string) {
  const summary = await generateSummary(await loadSummaryInput(callId));
  if (!summary) throw new Error(`Summary not generated for call ${callId}`);
  await insertCallSummary(callId, summary);
}
