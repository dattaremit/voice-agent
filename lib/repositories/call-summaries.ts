import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { callSummaries, calls } from "@/lib/db/schema";
import type { CallSummary } from "@/lib/schemas/call-summary";

export const listRecentSummariesForPatient = (patientId: string, limit: number, excludeCallId?: string) =>
  db
    .select({
      date: callSummaries.createdAt,
      triageLevel: callSummaries.triageLevel,
      summary: callSummaries.summary,
      reasonForVisit: callSummaries.reasonForVisit,
      appointment: callSummaries.appointment,
    })
    .from(callSummaries)
    .innerJoin(calls, eq(callSummaries.callId, calls.id))
    .where(and(eq(calls.patientId, patientId), excludeCallId ? ne(calls.id, excludeCallId) : undefined))
    .orderBy(desc(callSummaries.createdAt))
    .limit(limit);

export const insertCallSummary = (callId: string, summary: CallSummary) =>
  db.insert(callSummaries).values({ ...summary, callId }).onConflictDoNothing({ target: callSummaries.callId });

export const getCallSummary = async (callId: string) => {
  const [summary] = await db.select().from(callSummaries).where(eq(callSummaries.callId, callId));
  return summary;
};
