import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { patients } from "@/lib/db/schema";

export const findPatientByIdentity = async (name: string, dateOfBirth: string) => {
  const [patient] = await db
    .select({ id: patients.id, name: patients.name })
    .from(patients)
    .where(and(sql`lower(${patients.name}) = lower(${name.trim()})`, eq(patients.dateOfBirth, dateOfBirth)));
  return patient;
};

export const getPatient = async (id: string) => {
  const [patient] = await db.select().from(patients).where(eq(patients.id, id));
  return patient;
};
