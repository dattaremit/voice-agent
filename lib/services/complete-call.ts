import { db } from "@/lib/db/client";
import { markCallEnded } from "@/lib/repositories/calls";
import { insertCallTurns } from "@/lib/repositories/call-turns";
import type { CallCompletion } from "@/lib/schemas/call-completion";

const hasPatientSpoken = (turns: CallCompletion["turns"]) => turns.some((turn) => turn.role === "patient");

export async function completeCall(callId: string, { turns }: CallCompletion) {
  return db.transaction(async (tx) => {
    const call = await markCallEnded(callId, hasPatientSpoken(turns) ? "completed" : "failed", tx);
    if (call) await insertCallTurns(callId, turns, tx);
    return call;
  });
}
