import type { SummaryInput } from "@/modules/summaries/load-summary-input";
import { clinicLabel } from "@/modules/scheduling/zoned-time";

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
