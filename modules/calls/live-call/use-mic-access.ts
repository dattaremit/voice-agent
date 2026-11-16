"use client";

import { useCallback, useEffect, useState } from "react";
import { type MicAccess, readMicPermission, requestMicrophone } from "./request-microphone";

export function useMicAccess() {
  const [access, setAccess] = useState<MicAccess>("checking");

  const request = useCallback(async () => setAccess(await requestMicrophone()), []);

  useEffect(() => {
    let active = true;
    readMicPermission().then(async (state) => {
      const resolved = state === "granted" ? await requestMicrophone() : state;
      if (active) setAccess(resolved);
    });
    return () => {
      active = false;
    };
  }, []);

  return { access, request };
}
