import { zodTextFormat } from "openai/helpers/zod";
import { env } from "@/lib/env";
import { callSummarySchema } from "@/modules/summaries/call-summary";
import { openai } from "@/lib/openai";
import type { SummaryInput } from "@/modules/summaries/load-summary-input";
import { SUMMARY_INSTRUCTIONS } from "@/modules/summaries/summary-instructions";
import { buildSummaryPrompt } from "@/modules/summaries/summary-prompt";

export async function generateSummary(input: SummaryInput) {
  const response = await openai.responses.parse({
    model: env.OPENAI_SUMMARY_MODEL,
    store: false,
    reasoning: { effort: "low" },
    instructions: SUMMARY_INSTRUCTIONS,
    input: buildSummaryPrompt(input),
    text: { format: zodTextFormat(callSummarySchema, "call_summary") },
  });
  return response.output_parsed;
}
