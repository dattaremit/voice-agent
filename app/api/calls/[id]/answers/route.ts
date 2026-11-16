import { activeCallRoute } from "@/lib/api/active-call-route";
import { insertCallAnswer } from "@/lib/repositories/call-answers";
import { callAnswerSchema } from "@/lib/schemas/call-answer";

export const POST = activeCallRoute(callAnswerSchema, async (call, answer) => {
  await insertCallAnswer(call.id, answer.questionKey, answer.value);
  return new Response(null, { status: 204 });
});
