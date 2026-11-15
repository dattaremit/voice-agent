import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { env } from "@/lib/env";
import { listCallAnswers } from "@/lib/repositories/call-answers";
import { insertCallSummary, listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import { listCallTurns } from "@/lib/repositories/call-turns";
import { getVisit } from "@/lib/repositories/visits";
import { callSummarySchema } from "@/lib/schemas/call-summary";
import { anthropic } from "./anthropic";
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
  const response = await anthropic.beta.messages.parse({
    model: env.ANTHROPIC_SUMMARY_MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(callSummarySchema) },
    system: SUMMARY_INSTRUCTIONS,
    messages: [{ role: "user", content: buildSummaryPrompt(await loadSummaryInput(callId, visitId)) }],
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new Error(`Summary not generated for call ${callId}: ${response.stop_reason}`);
  }
  await insertCallSummary(callId, response.parsed_output);
}
