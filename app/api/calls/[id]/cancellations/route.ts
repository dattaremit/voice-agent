import { identifiedCallRoute } from "@/modules/calls/identified-call-route";
import { errorResponse } from "@/lib/api/responses";
import { cancelAppointment } from "@/modules/scheduling/appointment-repository";
import { cancellationRequestSchema } from "@/modules/scheduling/cancellation-request";

export const POST = identifiedCallRoute(cancellationRequestSchema, async (call, { appointmentId }) => {
  const cancelled = await cancelAppointment(appointmentId, call.patientId);
  return cancelled ? Response.json({ cancelled: true }) : errorResponse(404, "No booked appointment found for this patient");
});
