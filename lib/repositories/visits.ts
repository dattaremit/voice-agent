import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { patients, visits } from "@/lib/db/schema";

export const listVisits = () =>
  db
    .select({
      id: visits.id,
      visitDate: visits.visitDate,
      reason: visits.reason,
      clinicianName: visits.clinicianName,
      patientName: patients.name,
    })
    .from(visits)
    .innerJoin(patients, eq(visits.patientId, patients.id))
    .orderBy(desc(visits.visitDate));

export type VisitListItem = Awaited<ReturnType<typeof listVisits>>[number];
