"use client";

import { useRouter } from "next/navigation";
import { RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";

export function RefreshOnDisconnect() {
  const router = useRouter();
  useRTVIClientEvent(RTVIEvent.Disconnected, () => router.refresh());
  return null;
}
