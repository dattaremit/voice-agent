import { activeCallRoute } from "@/modules/calls/active-call-route";
import { availabilityRequestSchema } from "@/modules/scheduling/availability-request";
import { findAvailableSlots } from "@/modules/scheduling/availability";

export const POST = activeCallRoute(availabilityRequestSchema, async (_call, request) =>
  Response.json({ slots: await findAvailableSlots(request) }),
);
