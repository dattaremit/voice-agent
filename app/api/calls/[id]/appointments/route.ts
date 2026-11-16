import { identifiedCallRoute } from "@/modules/calls/identified-call-route";
import { bookingRequestSchema } from "@/modules/scheduling/booking-request";
import { bookAppointment } from "@/modules/scheduling/book-appointment";

export const POST = identifiedCallRoute(bookingRequestSchema, async (call, request) => {
  const result = await bookAppointment(call.id, call.patientId, request);
  return Response.json(result, { status: result.booked ? 201 : 409 });
});
