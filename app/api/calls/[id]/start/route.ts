import { agentCallRoute } from "@/lib/api/agent-call-route";
import { errorResponse } from "@/lib/api/responses";
import { markCallStarted } from "@/modules/calls/call-repository";
import { buildCallContext } from "@/modules/calls/call-context";

export const POST = agentCallRoute(async (callId) => {
  const call = await markCallStarted(callId);
  return call ? Response.json(await buildCallContext(call.id)) : errorResponse(409, "Call is not scheduled");
});
