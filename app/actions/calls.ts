"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCall } from "@/lib/repositories/calls";
import { idSchema } from "@/lib/schemas/id";

export async function startCall(visitId: string) {
  const id = idSchema.parse(visitId);
  const call = await createCall(id);
  revalidatePath(`/visits/${id}`);
  redirect(`/calls/${call.id}`);
}
