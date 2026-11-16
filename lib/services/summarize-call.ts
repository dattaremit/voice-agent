import { zodTextFormat } from "openai/helpers/zod";
import { env } from "@/lib/env";
import { listCallAnswers } from "@/lib/repositories/call-answers";
import { insertCallSummary, listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import { listCallTurns } from "@/lib/repositories/call-turns";
import { getVisit } from "@/lib/repositories/visits";
import { callSummarySchema } from "@/lib/schemas/call-summary";
import { openai } from "./openai";
import { SUMMARY_INSTRUCTIONS } from "./summary-instructions";
import { buildSummaryPrompt } from "./summary-prompt";

const previousCallLimit = 3;

async function loadSummaryInput(callId: string, visitId: string) {
  const visit = await getVisit(visitId);
  if (!visit) throw new Error(`Visit ${visitId} not found`);
  const [answers, turns, previousCalls] = await Promise.all([
    listCallAnswers(callId),
    listCallTurns(callId),
    listRecentSummariesForPatient(visit.patientId, previousCallLimit),
  ]);
  return { visit, answers, turns, previousCalls };
}

export async function summarizeCall(callId: string, visitId: string) {
  const response = await openai.responses.parse({
    model: env.OPENAI_SUMMARY_MODEL,
    store: false,
    reasoning: { effort: "low" },
    instructions: SUMMARY_INSTRUCTIONS,
    input: buildSummaryPrompt(await loadSummaryInput(callId, visitId)),
    text: { format: zodTextFormat(callSummarySchema, "call_summary") },
  });
  if (!response.output_parsed) throw new Error(`Summary not generated for call ${callId}: ${response.status}`);
  await insertCallSummary(callId, response.output_parsed);
}
