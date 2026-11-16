import type { z } from "zod";
import { getActiveCall } from "@/modules/calls/active-call";
import { agentCallRoute } from "@/lib/api/agent-call-route";
import { parseBody } from "@/lib/api/parse-body";
import { errorResponse } from "@/lib/api/responses";

export type ActiveCall = NonNullable<Awaited<ReturnType<typeof getActiveCall>>>;

export const activeCallRoute = <T extends z.ZodType>(
  schema: T,
  handler: (call: ActiveCall, body: z.infer<T>) => Promise<Response>,
) =>
  agentCallRoute(async (callId, request) => {
    const body = await parseBody(request, schema);
    if (body === undefined) return errorResponse(422, "Invalid request");
    const call = await getActiveCall(callId);
    if (!call) return errorResponse(409, "Call is not in progress");
    return handler(call, body);
  });
