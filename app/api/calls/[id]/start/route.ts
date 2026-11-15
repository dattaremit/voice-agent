import { agentCallRoute } from "@/lib/api/agent-call-route";
import { errorResponse } from "@/lib/api/responses";
import { markCallStarted } from "@/lib/repositories/calls";
import { buildCallContext } from "@/lib/services/call-context";

export const POST = agentCallRoute(async (callId) => {
  const call = await markCallStarted(callId);
  if (!call) return errorResponse(409, "Call is not scheduled");
  const context = await buildCallContext(call.id, call.visitId);
  return context ? Response.json(context) : errorResponse(404, "Visit not found");
});
