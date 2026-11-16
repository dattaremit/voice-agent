import type { z } from "zod";
import { getActiveCall } from "@/lib/services/active-call";
import { agentCallRoute } from "./agent-call-route";
import { parseBody } from "./parse-body";
import { errorResponse } from "./responses";

type ActiveCall = NonNullable<Awaited<ReturnType<typeof getActiveCall>>>;

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

export const identifiedCallRoute = <T extends z.ZodType>(
  schema: T,
  handler: (call: ActiveCall & { patientId: string }, body: z.infer<T>) => Promise<Response>,
) =>
  activeCallRoute(schema, async (call, body) => {
    const { patientId } = call;
    if (!patientId) return errorResponse(403, "Patient has not been identified on this call");
    return handler({ ...call, patientId }, body);
  });
