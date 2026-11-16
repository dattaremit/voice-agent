import { z } from "zod";

export const identifyRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  dateOfBirth: z.iso.date(),
});
