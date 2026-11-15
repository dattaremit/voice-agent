import { date, jsonb, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, reference, timestampColumn } from "./columns";

export const callStatus = pgEnum("call_status", ["scheduled", "in_progress", "completed", "failed"]);
export const turnRole = pgEnum("turn_role", ["agent", "patient"]);
export const triageLevel = pgEnum("triage_level", ["routine", "follow_up", "urgent"]);

export const patients = pgTable("patients", {
  id: id(),
  name: text().notNull(),
  dateOfBirth: date().notNull(),
  phone: text().notNull(),
  createdAt: createdAt(),
});

export const visits = pgTable("visits", {
  id: id(),
  patientId: reference(() => patients.id),
  visitDate: date().notNull(),
  reason: text().notNull(),
  clinicianName: text().notNull(),
  notes: text(),
  createdAt: createdAt(),
});

export const calls = pgTable("calls", {
  id: id(),
  visitId: reference(() => visits.id),
  status: callStatus().notNull().default("scheduled"),
  startedAt: timestampColumn(),
  endedAt: timestampColumn(),
  createdAt: createdAt(),
});

export const callTurns = pgTable("call_turns", {
  id: id(),
  callId: reference(() => calls.id),
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
  symptoms: jsonb().$type<string[]>().notNull(),
  medicationAdherence: text().notNull(),
  redFlags: jsonb().$type<string[]>().notNull(),
  actions: jsonb().$type<string[]>().notNull(),
  createdAt: createdAt(),
});
