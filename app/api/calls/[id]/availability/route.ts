import { activeCallRoute } from "@/lib/api/active-call-route";
import { availabilityRequestSchema } from "@/lib/schemas/availability-request";
import { findAvailableSlots } from "@/lib/services/availability";

export const POST = activeCallRoute(availabilityRequestSchema, async (_call, request) =>
  Response.json({ slots: await findAvailableSlots(request) }),
);
