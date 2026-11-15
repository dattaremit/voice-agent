import { notFound } from "next/navigation";
import { idSchema } from "@/lib/schemas/id";

export async function requireRouteId(params: Promise<{ id: string }>) {
  const result = idSchema.safeParse((await params).id);
  if (!result.success) notFound();
  return result.data;
}

export function requireRecord<T>(record: T | undefined): T {
  if (!record) notFound();
  return record;
}
