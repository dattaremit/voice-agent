import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { calls } from "@/lib/db/schema";

export const createCall = async (visitId: string) => {
  const [call] = await db.insert(calls).values({ visitId }).returning({ id: calls.id });
  return call;
};

export const listCallsForVisit = (visitId: string) =>
  db
    .select({ id: calls.id, status: calls.status, createdAt: calls.createdAt })
    .from(calls)
    .where(eq(calls.visitId, visitId))
    .orderBy(desc(calls.createdAt));

export const getCall = async (id: string) => {
  const [call] = await db
    .select({ id: calls.id, status: calls.status, visitId: calls.visitId, createdAt: calls.createdAt })
    .from(calls)
    .where(eq(calls.id, id));
  return call;
};

export type CallListItem = Awaited<ReturnType<typeof listCallsForVisit>>[number];
export type CallStatus = CallListItem["status"];
