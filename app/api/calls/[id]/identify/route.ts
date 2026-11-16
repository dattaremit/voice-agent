import { activeCallRoute } from "@/modules/calls/active-call-route";
import { errorResponse } from "@/lib/api/responses";
import { identifyRequestSchema } from "@/modules/patients/identify-request";
import { identifyPatient } from "@/modules/patients/identify-patient";

export const POST = activeCallRoute(identifyRequestSchema, async (call, { name, dateOfBirth }) => {
  const patient = await identifyPatient(call.id, name, dateOfBirth);
  return patient ? Response.json(patient) : errorResponse(404, "No patient matches that name and date of birth");
});
