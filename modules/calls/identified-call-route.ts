import type { z } from "zod";
import { type ActiveCall, activeCallRoute } from "@/modules/calls/active-call-route";
import { errorResponse } from "@/lib/api/responses";

export type IdentifiedCall = ActiveCall & { patientId: string };

export const identifiedCallRoute = <T extends z.ZodType>(
  schema: T,
  handler: (call: IdentifiedCall, body: z.infer<T>) => Promise<Response>,
) =>
  activeCallRoute(schema, async (call, body) => {
    const { patientId } = call;
    if (!patientId) return errorResponse(403, "Patient has not been identified on this call");
    return handler({ ...call, patientId }, body);
  });
