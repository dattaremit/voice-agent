import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { patients, visits } from "@/lib/db/schema";
import type { SelectedFields } from "drizzle-orm/pg-core";

const visitSummary = {
  id: visits.id,
  visitDate: visits.visitDate,
  reason: visits.reason,
  clinicianName: visits.clinicianName,
  patientName: patients.name,
};

const visitsWithPatients = <T extends SelectedFields>(fields: T) =>
  db.select(fields).from(visits).innerJoin(patients, eq(visits.patientId, patients.id));

export const listVisits = () => visitsWithPatients(visitSummary).orderBy(desc(visits.visitDate));

export const getVisit = async (id: string) => {
  const [visit] = await visitsWithPatients({
    ...visitSummary,
    notes: visits.notes,
    patientDateOfBirth: patients.dateOfBirth,
    patientPhone: patients.phone,
  }).where(eq(visits.id, id));
  return visit;
};

export type VisitListItem = Awaited<ReturnType<typeof listVisits>>[number];
export type VisitDetail = NonNullable<Awaited<ReturnType<typeof getVisit>>>;
