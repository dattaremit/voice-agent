"use client";

import type { ReactNode } from "react";
import { Mic, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MicAccessNotice } from "./mic-access-notice";
import { useMicAccess } from "./use-mic-access";

export function MicAccessGate({ children }: { children: ReactNode }) {
  const { access, request } = useMicAccess();

  if (access === "checking") return <Skeleton className="h-10 w-44 rounded-full" />;
  if (access === "granted") return children;

  if (access === "prompt") {
    return (
      <MicAccessNotice title="Ava needs your microphone">
        <p className="mb-3">Allow microphone access so Ava can hear you during the call.</p>
        <Button onClick={request}>
          <Mic />
          Allow microphone
        </Button>
      </MicAccessNotice>
    );
  }

  return (
    <MicAccessNotice title={access === "missing" ? "No microphone found" : "Microphone access is blocked"}>
      <p className="mb-3">
        {access === "missing"
          ? "Connect a headset or choose an input in System Settings → Sound, then try again."
          : "Click the icon at the left of the address bar, set Microphone to Allow, then try again."}
      </p>
      <Button variant="outline" onClick={request}>
        <RotateCw />
        Try again
      </Button>
    </MicAccessNotice>
  );
}
