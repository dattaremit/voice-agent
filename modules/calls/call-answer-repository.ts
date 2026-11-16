import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { callAnswers } from "@/lib/db/schema";

export const insertCallAnswer = (callId: string, questionKey: string, value: string) =>
  db.insert(callAnswers).values({ callId, questionKey, value });

export const listCallAnswers = (callId: string) =>
  db
    .select({ questionKey: callAnswers.questionKey, value: callAnswers.value })
    .from(callAnswers)
    .where(eq(callAnswers.callId, callId))
    .orderBy(asc(callAnswers.createdAt));
