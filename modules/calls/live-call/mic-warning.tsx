"use client";

import { MicOff } from "lucide-react";
import { micErrorMessage } from "./mic-error-message";
import { useMicError } from "./use-mic-error";

export function MicWarning() {
  const micError = useMicError();
  if (!micError) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <MicOff className="mt-0.5 size-4 shrink-0" />
      {micErrorMessage(micError)}
    </p>
  );
}
