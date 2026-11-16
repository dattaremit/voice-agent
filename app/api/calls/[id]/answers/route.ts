import { activeCallRoute } from "@/modules/calls/active-call-route";
import { insertCallAnswer } from "@/modules/calls/call-answer-repository";
import { callAnswerSchema } from "@/modules/calls/call-answer";

export const POST = activeCallRoute(callAnswerSchema, async (call, answer) => {
  await insertCallAnswer(call.id, answer.questionKey, answer.value);
  return new Response(null, { status: 204 });
});
