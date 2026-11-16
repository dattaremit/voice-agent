import { listUpcomingForPatient } from "@/modules/scheduling/appointment-repository";
import { setCallPatient } from "@/modules/calls/call-repository";
import { listRecentSummariesForPatient } from "@/modules/summaries/summary-repository";
import { findPatientByIdentity } from "@/modules/patients/patient-repository";
import { appointmentView } from "@/modules/scheduling/appointment-view";

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
