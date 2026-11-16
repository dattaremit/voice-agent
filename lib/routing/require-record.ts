import { notFound } from "next/navigation";

export function requireRecord<T>(record: T | undefined): T {
  if (!record) notFound();
  return record;
}
