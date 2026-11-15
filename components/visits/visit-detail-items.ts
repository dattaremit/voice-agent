import type { DetailItem } from "@/components/shared/detail-list";
import { formatDate } from "@/lib/format";
import type { VisitDetail } from "@/lib/repositories/visits";

export const visitDetailItems = (visit: VisitDetail): DetailItem[] => [
  { label: "Patient", value: visit.patientName },
  { label: "Date of birth", value: formatDate(visit.patientDateOfBirth) },
  { label: "Phone", value: visit.patientPhone },
  { label: "Visit date", value: formatDate(visit.visitDate) },
  { label: "Reason", value: visit.reason },
  { label: "Clinician", value: visit.clinicianName },
  { label: "Discharge notes", value: visit.notes ?? "None" },
];
