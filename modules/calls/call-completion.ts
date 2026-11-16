import { z } from "zod";

export const callCompletionSchema = z.object({
  turns: z
    .array(
      z.object({
        role: z.enum(["agent", "patient"]),
        text: z.string().trim().min(1).max(4000),
      }),
    )
    .max(500),
});

export type CallCompletion = z.infer<typeof callCompletionSchema>;
