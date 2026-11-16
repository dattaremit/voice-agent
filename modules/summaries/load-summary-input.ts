import { listAppointmentsForCall } from "@/modules/scheduling/appointment-repository";
import { listCallAnswers } from "@/modules/calls/call-answer-repository";
import { listRecentSummariesForPatient } from "@/modules/summaries/summary-repository";
import { listCallTurns } from "@/modules/calls/call-turn-repository";
import { getCall } from "@/modules/calls/call-repository";
import { getPatient } from "@/modules/patients/patient-repository";

const previousCallLimit = 3;

export async function loadSummaryInput(callId: string) {
  const patientId = (await getCall(callId))?.patientId;
  const [patient, answers, appointments, turns, previousCalls] = await Promise.all([
    patientId ? getPatient(patientId) : undefined,
    listCallAnswers(callId),
    listAppointmentsForCall(callId),
    listCallTurns(callId),
    patientId ? listRecentSummariesForPatient(patientId, previousCallLimit, callId) : [],
  ]);
  return { patientName: patient?.name, answers, appointments, turns, previousCalls };
}

export type SummaryInput = Awaited<ReturnType<typeof loadSummaryInput>>;
