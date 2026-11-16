import { and, asc, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { appointments, clinicians, patients } from "@/lib/db/schema";

const appointmentFields = {
  id: appointments.id,
  startsAt: appointments.startsAt,
  reason: appointments.reason,
  status: appointments.status,
  clinicianName: clinicians.name,
  specialty: clinicians.specialty,
  patientName: patients.name,
};

const appointmentsWithPeople = () =>
  db
    .select(appointmentFields)
    .from(appointments)
    .innerJoin(clinicians, eq(appointments.clinicianId, clinicians.id))
    .innerJoin(patients, eq(appointments.patientId, patients.id));

const booked = eq(appointments.status, "booked");

export const listBookedSlotsSince = (from: Date) =>
  db
    .select({ clinicianId: appointments.clinicianId, startsAt: appointments.startsAt })
    .from(appointments)
    .where(and(booked, gte(appointments.startsAt, from)));

export const listUpcomingAppointments = (from: Date) =>
  appointmentsWithPeople().where(and(booked, gte(appointments.startsAt, from))).orderBy(asc(appointments.startsAt));

export const listUpcomingForPatient = (patientId: string, from: Date) =>
  appointmentsWithPeople()
    .where(and(booked, eq(appointments.patientId, patientId), gte(appointments.startsAt, from)))
    .orderBy(asc(appointments.startsAt));

export const listAppointmentsForCall = (callId: string) =>
  appointmentsWithPeople().where(eq(appointments.callId, callId)).orderBy(asc(appointments.startsAt));

type NewAppointment = typeof appointments.$inferInsert;

export const insertAppointment = async (appointment: NewAppointment) => {
  const [created] = await db.insert(appointments).values(appointment).onConflictDoNothing().returning({ id: appointments.id });
  return created;
};

export const cancelAppointment = async (id: string, patientId: string) => {
  const [cancelled] = await db
    .update(appointments)
    .set({ status: "cancelled" })
    .where(and(eq(appointments.id, id), eq(appointments.patientId, patientId), booked))
    .returning({ id: appointments.id });
  return cancelled;
};

export type AppointmentListItem = Awaited<ReturnType<typeof listUpcomingAppointments>>[number];
