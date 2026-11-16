"use server";

import { redirect } from "next/navigation";
import { createCall } from "@/lib/repositories/calls";

export async function startCall() {
  const call = await createCall();
  redirect(`/calls/${call.id}`);
}
