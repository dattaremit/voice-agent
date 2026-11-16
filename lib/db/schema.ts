import { sql } from "drizzle-orm";
import { date, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, id, optionalReference, reference, timestampColumn } from "./columns";

export const callStatus = pgEnum("call_status", ["scheduled", "in_progress", "completed", "failed"]);
export const turnRole = pgEnum("turn_role", ["agent", "patient"]);
export const triageLevel = pgEnum("triage_level", ["routine", "follow_up", "urgent"]);
export const appointmentStatus = pgEnum("appointment_status", ["booked", "cancelled"]);

export const patients = pgTable("patients", {
  id: id(),
  name: text().notNull(),
  dateOfBirth: date().notNull(),
  phone: text().notNull(),
  createdAt: createdAt(),
});

export const clinicians = pgTable("clinicians", {
  id: id(),
  name: text().notNull(),
  specialty: text().notNull(),
  createdAt: createdAt(),
});

export const calls = pgTable("calls", {
  id: id(),
  patientId: optionalReference(() => patients.id),
  status: callStatus().notNull().default("scheduled"),
  startedAt: timestampColumn(),
  endedAt: timestampColumn(),
  createdAt: createdAt(),
});

export const appointments = pgTable(
  "appointments",
  {
    id: id(),
    patientId: reference(() => patients.id),
    clinicianId: reference(() => clinicians.id),
    callId: optionalReference(() => calls.id),
    startsAt: timestamp({ withTimezone: true }).notNull(),
    reason: text().notNull(),
    status: appointmentStatus().notNull().default("booked"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("appointments_clinician_slot_booked")
      .on(table.clinicianId, table.startsAt)
      .where(sql`${table.status} = 'booked'`),
  ],
);

export const callTurns = pgTable("call_turns", {
  id: id(),
  callId: reference(() => calls.id),
  position: integer().notNull(),
  role: turnRole().notNull(),
  text: text().notNull(),
  createdAt: createdAt(),
});

export const callAnswers = pgTable("call_answers", {
  id: id(),
  callId: reference(() => calls.id),
  questionKey: text().notNull(),
  value: jsonb().notNull(),
  createdAt: createdAt(),
});

export const callSummaries = pgTable("call_summaries", {
  id: id(),
  callId: reference(() => calls.id).unique(),
  triageLevel: triageLevel().notNull(),
  summary: text().notNull(),
  reasonForVisit: text().notNull(),
  symptoms: jsonb().$type<string[]>().notNull(),
  appointment: text().notNull(),
  redFlags: jsonb().$type<string[]>().notNull(),
  actions: jsonb().$type<string[]>().notNull(),
  createdAt: createdAt(),
});
