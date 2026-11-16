import { z } from "zod";

export const bookingRequestSchema = z.object({
  clinicianId: z.uuid(),
  startsAt: z.iso.datetime(),
  reason: z.string().trim().min(2).max(300),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
