import { z } from "zod";

export const identifyRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  dateOfBirth: z.iso.date(),
});

export const bookingRequestSchema = z.object({
  clinicianId: z.uuid(),
  startsAt: z.iso.datetime(),
  reason: z.string().trim().min(2).max(300),
});

export const cancellationRequestSchema = z.object({
  appointmentId: z.uuid(),
});
