import type { listAppointmentsForCall } from "@/lib/repositories/appointments";
import type { listCallAnswers } from "@/lib/repositories/call-answers";
import type { listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import type { listCallTurns } from "@/lib/repositories/call-turns";
import { clinicLabel } from "@/lib/scheduling/zoned-time";

type SummaryInput = {
  patientName: string | undefined;
  answers: Awaited<ReturnType<typeof listCallAnswers>>;
  appointments: Awaited<ReturnType<typeof listAppointmentsForCall>>;
  turns: Awaited<ReturnType<typeof listCallTurns>>;
  previousCalls: Awaited<ReturnType<typeof listRecentSummariesForPatient>>;
};

const section = (title: string, lines: string[]) => `${title}:\n${lines.length ? lines.join("\n") : "None."}`;

export const buildSummaryPrompt = ({ patientName, answers, appointments, turns, previousCalls }: SummaryInput) =>
  [
    section("Patient", [patientName ?? "Not identified"]),
    section("Previous calls", previousCalls.map((call) => `- ${call.reasonForVisit}: ${call.appointment}`)),
    section("Intake answers", answers.map((answer) => `- ${answer.questionKey}: ${String(answer.value)}`)),
    section(
      "Appointments changed on this call",
      appointments.map((item) => `- ${item.status}: ${item.clinicianName}, ${clinicLabel(item.startsAt)}, ${item.reason}`),
    ),
    section("Transcript", turns.map((turn) => `${turn.role === "agent" ? "Agent" : "Patient"}: ${turn.text}`)),
  ].join("\n\n");
