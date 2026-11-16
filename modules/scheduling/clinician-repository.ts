import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { clinicians } from "@/lib/db/schema";

const clinicianFields = { id: clinicians.id, name: clinicians.name, specialty: clinicians.specialty };

export const listClinicians = () => db.select(clinicianFields).from(clinicians).orderBy(asc(clinicians.name));

export const getClinician = async (id: string) => {
  const [clinician] = await db.select(clinicianFields).from(clinicians).where(eq(clinicians.id, id));
  return clinician;
};

export type Clinician = Awaited<ReturnType<typeof listClinicians>>[number];
