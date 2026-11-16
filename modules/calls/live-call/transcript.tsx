"use client";

import { usePipecatConversation } from "@pipecat-ai/client-react";
import { type Speaker, TranscriptBubble } from "@/components/shared/transcript-bubble";
import { messageText } from "@/modules/calls/live-call/message-text";

const speakers: Partial<Record<string, Speaker>> = { user: "patient", assistant: "agent" };

export function Transcript() {
  const { messages } = usePipecatConversation();
  const turns = messages.flatMap((message) => {
    const speaker = speakers[message.role];
    return speaker ? [{ key: message.createdAt, speaker, text: messageText(message) }] : [];
  });
  if (turns.length === 0) return <p className="text-sm text-muted-foreground">The transcript appears here once the call starts.</p>;
  return (
    <ol className="space-y-3">
      {turns.map((turn) => (
        <TranscriptBubble key={turn.key} speaker={turn.speaker}>
          {turn.text}
        </TranscriptBubble>
      ))}
    </ol>
  );
}
