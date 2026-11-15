import { formatDate } from "@/lib/format";
import type { listCallAnswers } from "@/lib/repositories/call-answers";
import type { listRecentSummariesForPatient } from "@/lib/repositories/call-summaries";
import type { listCallTurns } from "@/lib/repositories/call-turns";
import type { VisitDetail } from "@/lib/repositories/visits";

type SummaryInput = {
  visit: VisitDetail;
  answers: Awaited<ReturnType<typeof listCallAnswers>>;
  turns: Awaited<ReturnType<typeof listCallTurns>>;
  previousCalls: Awaited<ReturnType<typeof listRecentSummariesForPatient>>;
};

const section = (title: string, lines: string[]) => `${title}:\n${lines.length ? lines.join("\n") : "None."}`;

export const buildSummaryPrompt = ({ visit, answers, turns, previousCalls }: SummaryInput) =>
  [
    section("Visit", [
      `${visit.patientName}, seen ${formatDate(visit.visitDate)} by ${visit.clinicianName} for ${visit.reason}.`,
      `Notes: ${visit.notes ?? "none"}`,
    ]),
    section(
      "Previous follow-up calls",
      previousCalls.map((call) => `- ${formatDate(call.date)} (${call.triageLevel}): ${call.summary}`),
    ),
    section("Recorded answers", answers.map((answer) => `- ${answer.questionKey}: ${String(answer.value)}`)),
    section("Transcript", turns.map((turn) => `${turn.role === "agent" ? "Agent" : "Patient"}: ${turn.text}`)),
  ].join("\n\n");
