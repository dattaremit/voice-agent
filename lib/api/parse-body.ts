import type { z } from "zod";

export async function parseBody<T extends z.ZodType>(request: Request, schema: T) {
  const result = schema.safeParse(await request.json().catch(() => undefined));
  return result.success ? result.data : undefined;
}
