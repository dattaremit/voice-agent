"use server";

import { redirect } from "next/navigation";
import { createCall } from "@/modules/calls/call-repository";

export async function startCall() {
  const call = await createCall();
  redirect(`/calls/${call.id}`);
}
