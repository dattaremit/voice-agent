import { listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import { getVisit } from "@/lib/repositories/visits";

const previousCallLimit = 3;

export async function buildCallContext(callId: string, visitId: string) {
  const visit = await getVisit(visitId);
  if (!visit) return undefined;
  return {
    callId,
    patient: { name: visit.patientName, dateOfBirth: visit.patientDateOfBirth },
    visit: {
      date: visit.visitDate,
      reason: visit.reason,
      clinicianName: visit.clinicianName,
      notes: visit.notes,
    },
    previousCalls: await listRecentSummariesForPatient(visit.patientId, previousCallLimit),
  };
}
