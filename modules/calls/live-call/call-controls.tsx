"use client";

import { PhoneCall, PhoneOff } from "lucide-react";
import { usePipecatClient, usePipecatClientTransportState } from "@pipecat-ai/client-react";
import { Button } from "@/components/ui/button";
import { publicEnv } from "@/lib/public-env";

const idleStates = new Set(["disconnected", "initialized", "error"]);

export function CallControls({ callId }: { callId: string }) {
  const client = usePipecatClient();
  const state = usePipecatClientTransportState();
  const idle = idleStates.has(state);

  const start = () =>
    client?.startBotAndConnect({
      endpoint: `${publicEnv.NEXT_PUBLIC_AGENT_URL}/start`,
      requestData: { body: { callId } },
    });

  return (
    <div className="flex items-center gap-3">
      {idle ? (
        <Button size="lg" onClick={start}>
          <PhoneCall />
          Connect agent
        </Button>
      ) : (
        <Button size="lg" variant="destructive" onClick={() => client?.disconnect()}>
          <PhoneOff />
          End call
        </Button>
      )}
      <span className="text-sm capitalize text-muted-foreground">{state}</span>
    </div>
  );
}
