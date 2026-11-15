"use client";

import { PipecatClientAudio, PipecatClientProvider } from "@pipecat-ai/client-react";
import { CallControls } from "./call-controls";
import { RefreshOnDisconnect } from "./refresh-on-disconnect";
import { Transcript } from "./transcript";
import { usePipecatClientInstance } from "./use-pipecat-client";

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
