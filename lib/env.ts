import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  AGENT_WEBHOOK_SECRET: z.string().min(32),
  ANTHROPIC_API_KEY: z.string().min(1),
  ANTHROPIC_SUMMARY_MODEL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
