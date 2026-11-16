"use client";

import { useEffect, useState } from "react";
import { PipecatClient } from "@pipecat-ai/client-js";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";

const createClient = () =>
  new PipecatClient({ transport: new SmallWebRTCTransport(), enableMic: true, enableCam: false });

export function usePipecatClientInstance() {
  const [client] = useState(createClient);
  useEffect(() => () => void client.disconnect(), [client]);
  return client;
}
