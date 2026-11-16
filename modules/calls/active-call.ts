import { getCall } from "@/modules/calls/call-repository";

export async function getActiveCall(callId: string) {
  const call = await getCall(callId);
  return call?.status === "in_progress" ? call : undefined;
}
