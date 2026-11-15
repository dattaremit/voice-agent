import { agentCallRoute } from "@/lib/api/agent-call-route";
import { isCallInProgress } from "@/lib/api/in-progress-call";
import { parseBody } from "@/lib/api/parse-body";
import { errorResponse } from "@/lib/api/responses";
import { insertCallAnswer } from "@/lib/repositories/call-answers";
import { callAnswerSchema } from "@/lib/schemas/call-answer";

export const POST = agentCallRoute(async (callId, request) => {
  const answer = await parseBody(request, callAnswerSchema);
  if (!answer) return errorResponse(422, "Invalid answer");
  if (!(await isCallInProgress(callId))) return errorResponse(409, "Call is not in progress");
  await insertCallAnswer(callId, answer.questionKey, answer.value);
  return new Response(null, { status: 204 });
});
