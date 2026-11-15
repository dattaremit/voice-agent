import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Speaker = "agent" | "patient";

const speakerLabels: Record<Speaker, string> = { agent: "Agent", patient: "Patient" };

export function TranscriptBubble({ speaker, children }: { speaker: Speaker; children: ReactNode }) {
  return (
    <li
      className={cn(
        "w-fit max-w-[85%] rounded-2xl px-4 py-2 text-sm",
        speaker === "agent" ? "bg-secondary" : "ml-auto bg-primary text-primary-foreground",
      )}
    >
      <span className="block text-xs opacity-70">{speakerLabels[speaker]}</span>
      {children}
    </li>
  );
}
