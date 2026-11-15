import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

const digest = (value: string) => createHash("sha256").update(value).digest();

const expected = digest(`Bearer ${env.AGENT_WEBHOOK_SECRET}`);

export const isAgentRequest = (request: Request) =>
  timingSafeEqual(digest(request.headers.get("authorization") ?? ""), expected);
