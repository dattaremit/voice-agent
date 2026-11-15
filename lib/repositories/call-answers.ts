import { db } from "@/lib/db/client";
import { callAnswers } from "@/lib/db/schema";

export const insertCallAnswer = (callId: string, questionKey: string, value: string) =>
  db.insert(callAnswers).values({ callId, questionKey, value });
