import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { callSummaries, calls, visits } from "@/lib/db/schema";

export const listRecentSummariesForPatient = (patientId: string, limit: number) =>
  db
    .select({
      date: callSummaries.createdAt,
      visitReason: visits.reason,
      triageLevel: callSummaries.triageLevel,
      summary: callSummaries.summary,
      medicationAdherence: callSummaries.medicationAdherence,
      redFlags: callSummaries.redFlags,
    })
    .from(callSummaries)
    .innerJoin(calls, eq(callSummaries.callId, calls.id))
    .innerJoin(visits, and(eq(calls.visitId, visits.id), eq(visits.patientId, patientId)))
    .orderBy(desc(callSummaries.createdAt))
    .limit(limit);
