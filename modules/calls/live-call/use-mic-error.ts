"use client";

import { useState } from "react";
import { type DeviceError, type DeviceErrorType, RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";

export function useMicError() {
  const [micError, setMicError] = useState<DeviceErrorType | null>(null);
  useRTVIClientEvent(RTVIEvent.DeviceError, (error: DeviceError) => {
    if (error.devices.includes("mic")) setMicError(error.type);
  });
  return micError;
}
