import { z } from "zod";

export const publicEnv = z
  .object({ NEXT_PUBLIC_AGENT_URL: z.url() })
  .parse({ NEXT_PUBLIC_AGENT_URL: process.env.NEXT_PUBLIC_AGENT_URL });
