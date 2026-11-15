import { agentCallRoute } from "@/lib/api/agent-call-route";
import { parseBody } from "@/lib/api/parse-body";
import { errorResponse } from "@/lib/api/responses";
import { callCompletionSchema } from "@/lib/schemas/call-completion";
import { completeCall } from "@/lib/services/complete-call";

export const POST = agentCallRoute(async (callId, request) => {
  const completion = await parseBody(request, callCompletionSchema);
  if (!completion) return errorResponse(422, "Invalid transcript");
  const call = await completeCall(callId, completion);
  return call ? new Response(null, { status: 204 }) : errorResponse(409, "Call is not in progress");
});
