import { z } from "zod";

export const callAnswerSchema = z.object({
  questionKey: z.string().regex(/^[a-z_]{1,64}$/),
  value: z.string().trim().min(1).max(2000),
});
