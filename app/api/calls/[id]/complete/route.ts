import { after } from "next/server";
import { agentCallRoute } from "@/lib/api/agent-call-route";
import { parseBody } from "@/lib/api/parse-body";
import { errorResponse } from "@/lib/api/responses";
import { callCompletionSchema } from "@/modules/calls/call-completion";
import { completeCall } from "@/modules/calls/complete-call";
import { summarizeCall } from "@/modules/summaries/summarize-call";

export const POST = agentCallRoute(async (callId, request) => {
  const completion = await parseBody(request, callCompletionSchema);
  if (!completion) return errorResponse(422, "Invalid transcript");
  const call = await completeCall(callId, completion);
  if (!call) return errorResponse(409, "Call is not in progress");
  if (call.status === "completed") after(() => summarizeCall(call.id).catch(console.error));
  return new Response(null, { status: 204 });
});
