import { asc, eq } from "drizzle-orm";
import { db, type DbExecutor } from "@/lib/db/client";
import { callTurns } from "@/lib/db/schema";
import type { CallCompletion } from "@/lib/schemas/call-completion";

export const insertCallTurns = async (callId: string, turns: CallCompletion["turns"], executor: DbExecutor = db) => {
  if (turns.length > 0) await executor.insert(callTurns).values(turns.map((turn, position) => ({ ...turn, position, callId })));
};

export const listCallTurns = (callId: string) =>
  db
    .select({ id: callTurns.id, role: callTurns.role, text: callTurns.text })
    .from(callTurns)
    .where(eq(callTurns.callId, callId))
    .orderBy(asc(callTurns.position));
