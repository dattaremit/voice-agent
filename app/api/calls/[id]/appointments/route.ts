import { identifiedCallRoute } from "@/lib/api/active-call-route";
import { bookingRequestSchema } from "@/lib/schemas/scheduling-requests";
import { bookAppointment } from "@/lib/services/book-appointment";

export const POST = identifiedCallRoute(bookingRequestSchema, async (call, request) => {
  const result = await bookAppointment(call.id, call.patientId, request);
  return Response.json(result, { status: result.booked ? 201 : 409 });
});
