import { z } from "zod";

export const callSummarySchema = z.object({
  triageLevel: z.enum(["routine", "follow_up", "urgent"]),
  summary: z.string(),
  reasonForVisit: z.string(),
  symptoms: z.array(z.string()),
  appointment: z.string(),
  redFlags: z.array(z.string()),
  actions: z.array(z.string()),
});

export type CallSummary = z.infer<typeof callSummarySchema>;
