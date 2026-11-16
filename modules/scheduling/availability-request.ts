import { z } from "zod";

export const availabilityRequestSchema = z.object({
  clinicianId: z.uuid().optional(),
  specialty: z.string().trim().min(1).optional(),
  date: z.iso.date().optional(),
  partOfDay: z.enum(["morning", "afternoon", "any"]).default("any"),
});

export type AvailabilityRequest = z.infer<typeof availabilityRequestSchema>;
