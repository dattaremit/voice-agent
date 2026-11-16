import { zodTextFormat } from "openai/helpers/zod";
import { env } from "@/lib/env";
import { listAppointmentsForCall } from "@/lib/repositories/appointments";
import { listCallAnswers } from "@/lib/repositories/call-answers";
import { insertCallSummary, listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import { listCallTurns } from "@/lib/repositories/call-turns";
import { getCall } from "@/lib/repositories/calls";
import { getPatient } from "@/lib/repositories/patients";
import { callSummarySchema } from "@/lib/schemas/call-summary";
import { openai } from "./openai";
import { SUMMARY_INSTRUCTIONS } from "./summary-instructions";
import { buildSummaryPrompt } from "./summary-prompt";

const previousCallLimit = 3;

async function loadSummaryInput(callId: string) {
  const patientId = (await getCall(callId))?.patientId;
  const [patient, answers, appointments, turns, previousCalls] = await Promise.all([
    patientId ? getPatient(patientId) : undefined,
    listCallAnswers(callId),
    listAppointmentsForCall(callId),
    listCallTurns(callId),
    patientId ? listRecentSummariesForPatient(patientId, previousCallLimit, callId) : [],
  ]);
  return { patientName: patient?.name, answers, appointments, turns, previousCalls };
}

export async function summarizeCall(callId: string) {
  const response = await openai.responses.parse({
    model: env.OPENAI_SUMMARY_MODEL,
    store: false,
    reasoning: { effort: "low" },
    instructions: SUMMARY_INSTRUCTIONS,
    input: buildSummaryPrompt(await loadSummaryInput(callId)),
    text: { format: zodTextFormat(callSummarySchema, "call_summary") },
  });
  if (!response.output_parsed) throw new Error(`Summary not generated for call ${callId}: ${response.status}`);
  await insertCallSummary(callId, response.output_parsed);
}
