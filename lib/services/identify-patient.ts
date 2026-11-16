import { listUpcomingForPatient } from "@/lib/repositories/appointments";
import { setCallPatient } from "@/lib/repositories/calls";
import { listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import { findPatientByIdentity } from "@/lib/repositories/patients";
import { appointmentView } from "./appointment-view";

const previousCallLimit = 3;

export async function identifyPatient(callId: string, name: string, dateOfBirth: string, now = new Date()) {
  const patient = await findPatientByIdentity(name, dateOfBirth);
  if (!patient) return undefined;
  await setCallPatient(callId, patient.id);
  const [upcoming, previousCalls] = await Promise.all([
    listUpcomingForPatient(patient.id, now),
    listRecentSummariesForPatient(patient.id, previousCallLimit, callId),
  ]);
  return {
    patientName: patient.name,
    upcomingAppointments: upcoming.map(appointmentView),
    previousCalls: previousCalls.map((call) => ({ reasonForVisit: call.reasonForVisit, appointment: call.appointment })),
  };
}
