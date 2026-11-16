import { z } from "zod";

export const cancellationRequestSchema = z.object({
  appointmentId: z.uuid(),
});
