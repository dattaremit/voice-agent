import { identifiedCallRoute } from "@/lib/api/active-call-route";
import { errorResponse } from "@/lib/api/responses";
import { cancelAppointment } from "@/lib/repositories/appointments";
import { cancellationRequestSchema } from "@/lib/schemas/scheduling-requests";

export const POST = identifiedCallRoute(cancellationRequestSchema, async (call, { appointmentId }) => {
  const cancelled = await cancelAppointment(appointmentId, call.patientId);
  return cancelled ? Response.json({ cancelled: true }) : errorResponse(404, "No booked appointment found for this patient");
});
