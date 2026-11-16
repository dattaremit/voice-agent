"use client";

import { PipecatClientAudio, PipecatClientProvider } from "@pipecat-ai/client-react";
import { CallControls } from "@/modules/calls/live-call/call-controls";
import { RefreshOnDisconnect } from "@/modules/calls/live-call/refresh-on-disconnect";
import { Transcript } from "@/modules/calls/live-call/transcript";
import { usePipecatClientInstance } from "@/modules/calls/live-call/use-pipecat-client";

export default function LiveCall({ callId }: { callId: string }) {
  const client = usePipecatClientInstance();
  return (
    <PipecatClientProvider client={client}>
      <div className="space-y-6">
        <CallControls callId={callId} />
        <Transcript />
      </div>
      <PipecatClientAudio />
      <RefreshOnDisconnect />
    </PipecatClientProvider>
  );
}
