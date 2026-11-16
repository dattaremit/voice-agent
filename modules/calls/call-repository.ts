import { and, desc, eq } from "drizzle-orm";
import { db, type DbExecutor } from "@/lib/db/client";
import { calls, patients } from "@/lib/db/schema";

export const createCall = async () => {
  const [call] = await db.insert(calls).values({}).returning({ id: calls.id });
  return call;
};

export const listRecentCalls = (limit: number) =>
  db
    .select({ id: calls.id, status: calls.status, createdAt: calls.createdAt, patientName: patients.name })
    .from(calls)
    .leftJoin(patients, eq(calls.patientId, patients.id))
    .orderBy(desc(calls.createdAt))
    .limit(limit);

export const getCall = async (id: string) => {
  const [call] = await db
    .select({ id: calls.id, status: calls.status, patientId: calls.patientId, createdAt: calls.createdAt })
    .from(calls)
    .where(eq(calls.id, id));
  return call;
};

export const markCallStarted = async (id: string) => {
  const [call] = await db
    .update(calls)
    .set({ status: "in_progress", startedAt: new Date() })
    .where(and(eq(calls.id, id), eq(calls.status, "scheduled")))
    .returning({ id: calls.id });
  return call;
};

export const setCallPatient = (id: string, patientId: string) =>
  db.update(calls).set({ patientId }).where(eq(calls.id, id));

export const markCallEnded = async (id: string, status: "completed" | "failed", executor: DbExecutor = db) => {
  const [call] = await executor
    .update(calls)
    .set({ status, endedAt: new Date() })
    .where(and(eq(calls.id, id), eq(calls.status, "in_progress")))
    .returning({ id: calls.id, status: calls.status });
  return call;
};

export type CallListItem = Awaited<ReturnType<typeof listRecentCalls>>[number];
export type CallStatus = CallListItem["status"];
